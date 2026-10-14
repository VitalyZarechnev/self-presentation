import * as THREE from 'three';

import { buildTimeline, sampleTimeline, TTimelineModel } from '@domain/geo/timeline';
import { tripCities } from '@domain/geo/tripCities';
import { resolveTrips } from '@domain/geo/trips';

import { clampZoom, pointerPosition, touchDistance, toVec } from './globeMath';
import { LabelSize, LabelSlot, layoutLabels, PinProjection, PlacedBox } from './labelLayout';
import { TripLayer } from './TripLayer';

const RADIUS = 1.55;
const MIN_ZOOM = 2.3;
const MAX_ZOOM = 5.2;
const HI_RES_ZOOM = 3.4;
const PIN_REF_ZOOM = 4.4;
const PIN_HIT_RADIUS = 22;
const TAP_SLOP = 6;

const FULL_LOOP_MS = 96000;

const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export type TTimelineInfo = {
  t: number;
  playing: boolean;
  follow: boolean;
  tripIndex: number | null;
  tripTitle: string | null;
  currentTime: number | null;
};

export type GeoGlobeOptions = {
  mount: HTMLElement;
  labels: readonly (HTMLElement | null)[];
  reduceMotion: boolean;
  pinColor: string;
  grabbingClass: string;
  cameraFollow: boolean;
  onSelect: (index: number | null) => void;
  onTimeline: (info: TTimelineInfo) => void;
  onFollowBlocked: () => void;
};

export class GeoGlobeController {
  private readonly mount: HTMLElement;
  private readonly labels: readonly (HTMLElement | null)[];
  private readonly grabbingClass: string;
  private readonly onSelect: (index: number | null) => void;
  private readonly onTimeline: (info: TTimelineInfo) => void;
  private readonly onFollowBlocked: () => void;

  private readonly timeline: TTimelineModel;
  private readonly tripLayer: TripLayer;
  private timelineT = 0;
  private timelinePlaying: boolean;
  private lastFrameMs = 0;
  private lastEmitKey = '';

  private cameraFollow: boolean;
  private readonly followTarget = new THREE.Quaternion();
  private readonly followUp = new THREE.Vector3(0, 1, 0);
  private readonly followE1 = new THREE.Vector3();
  private readonly followE2 = new THREE.Vector3();
  private readonly followBasis = new THREE.Matrix4();

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly globe: THREE.Group;
  private readonly earthGeo: THREE.SphereGeometry;
  private readonly earthMat: THREE.MeshPhongMaterial;
  private readonly texture: THREE.Texture;
  private readonly pinGeo: THREE.SphereGeometry;
  private readonly pinMat: THREE.MeshBasicMaterial;
  private readonly markers: THREE.Mesh[] = [];
  private readonly pinPositions: THREE.Vector3[];
  private readonly maxAnisotropy: number;
  private readonly observer: ResizeObserver;
  private hiResTexture: THREE.Texture | null = null;

  private width: number;
  private height: number;
  private selected: number | null = null;
  private hovering = false;
  private disposed = false;
  private needsRender = true;

  private dragging = false;
  private pinching = false;
  private prevX = 0;
  private prevY = 0;
  private velX = 0;
  private velY = 0;
  private pinchDist = 0;
  private downX = 0;
  private downY = 0;
  private moved = false;
  private followHintShown = false;

  private yaw = 2.6;
  private pitch = 0.26;
  private readonly qYaw = new THREE.Quaternion();
  private readonly qPitch = new THREE.Quaternion();
  private readonly axisX = new THREE.Vector3(1, 0, 0);
  private readonly axisY = new THREE.Vector3(0, 1, 0);
  private readonly tmpFacing = new THREE.Vector3();
  private readonly tmpQuat = new THREE.Quaternion();

  private running = false;
  private raf = 0;
  private readonly projected = new THREE.Vector3();
  private readonly projections: PinProjection[];
  private readonly placed: PlacedBox[];
  private readonly slots: LabelSlot[];
  private readonly sizes: (LabelSize | undefined)[];

  constructor(options: GeoGlobeOptions) {
    this.mount = options.mount;
    this.labels = options.labels;
    this.grabbingClass = options.grabbingClass;
    this.onSelect = options.onSelect;
    this.onTimeline = options.onTimeline;
    this.onFollowBlocked = options.onFollowBlocked;
    this.timelinePlaying = !options.reduceMotion;
    this.cameraFollow = options.cameraFollow;

    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 100);
    this.camera.position.z = PIN_REF_ZOOM;

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 0.75);
    sun.position.set(5, 3, 5);
    this.scene.add(sun);

    this.globe = new THREE.Group();
    this.scene.add(this.globe);

    this.maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.texture = new THREE.TextureLoader().load(`${ASSET_PREFIX}/textures/earth.jpg`, () => {
      this.needsRender = true;
    });
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = this.maxAnisotropy;
    this.earthGeo = new THREE.SphereGeometry(RADIUS, 64, 48);
    this.earthMat = new THREE.MeshPhongMaterial({ map: this.texture, shininess: 8 });
    this.globe.add(new THREE.Mesh(this.earthGeo, this.earthMat));

    this.pinGeo = new THREE.SphereGeometry(0.02, 12, 12);
    this.pinMat = new THREE.MeshBasicMaterial({ color: options.pinColor });
    this.pinPositions = tripCities.map((city) => {
      const position = toVec(city.lat, city.lon, RADIUS * 1.005);
      const marker = new THREE.Mesh(this.pinGeo, this.pinMat);
      marker.position.copy(position);
      this.globe.add(marker);
      this.markers.push(marker);
      return position;
    });

    this.globe.rotation.y = 2.6;
    this.globe.rotation.x = 0.26;

    const resolvedTrips = resolveTrips();
    this.timeline = buildTimeline(resolvedTrips);
    this.tripLayer = new TripLayer(this.globe, RADIUS, resolvedTrips, options.pinColor, ASSET_PREFIX);

    this.projections = tripCities.map((_, index) => ({ index, front: 0, sx: 0, sy: 0, important: false }));
    this.placed = tripCities.map(() => ({ cx: 0, cy: 0, w: 0, h: 0 }));
    this.slots = tripCities.map(() => ({ visible: false, left: 0, top: 0 }));
    this.sizes = tripCities.map(() => undefined);

    this.attachEvents();
    this.observer = new ResizeObserver(this.onResize);
    this.observer.observe(this.mount);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.render);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  setSelected(index: number | null): void {
    this.selected = index;
    this.needsRender = true;
  }

  setPinColor(color: string): void {
    this.pinMat.color.set(color);
    this.tripLayer.setColor(color);
    this.needsRender = true;
  }

  setTimelinePlaying(playing: boolean): void {
    this.timelinePlaying = playing;
    this.lastFrameMs = 0;
    this.needsRender = true;
  }

  setTimelineProgress(t: number): void {
    this.timelineT = clampZoom(t, 0, 1);
    this.needsRender = true;
  }

  setCameraFollow(follow: boolean): void {
    if (!follow && this.cameraFollow) {
      this.syncManualFromQuaternion();
      this.applyManualRotation();
    }
    this.cameraFollow = follow;
    this.needsRender = true;
  }

  private applyManualRotation(): void {
    this.qYaw.setFromAxisAngle(this.axisY, this.yaw);
    this.qPitch.setFromAxisAngle(this.axisX, this.pitch);
    this.globe.quaternion.multiplyQuaternions(this.qPitch, this.qYaw);
  }

  private syncManualFromQuaternion(): void {
    this.tmpQuat.copy(this.globe.quaternion).invert();
    this.tmpFacing.set(0, 0, 1).applyQuaternion(this.tmpQuat);
    this.pitch = Math.max(-1.2, Math.min(1.2, Math.asin(Math.max(-1, Math.min(1, this.tmpFacing.y)))));
    this.yaw = Math.atan2(-this.tmpFacing.x, this.tmpFacing.z);
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
    this.observer.disconnect();
    this.mount.removeEventListener('mousedown', this.onDown);
    this.mount.removeEventListener('touchstart', this.onDown);
    this.mount.removeEventListener('wheel', this.onWheel);
    this.mount.removeEventListener('pointerenter', this.onEnter);
    this.mount.removeEventListener('pointerleave', this.onLeave);
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('touchmove', this.onMove);
    window.removeEventListener('mouseup', this.onUp);
    window.removeEventListener('touchend', this.onUp);
    this.renderer.domElement.remove();
    this.renderer.dispose();
    this.earthGeo.dispose();
    this.earthMat.dispose();
    this.texture.dispose();
    this.hiResTexture?.dispose();
    this.pinGeo.dispose();
    this.pinMat.dispose();
    this.tripLayer.dispose();
  }

  private advanceTimeline(): void {
    const now = performance.now();
    if (this.timelinePlaying) {
      if (this.lastFrameMs !== 0) {
        this.timelineT += (now - this.lastFrameMs) / FULL_LOOP_MS;
        if (this.timelineT >= 1) this.timelineT -= Math.floor(this.timelineT);
      }
      this.needsRender = true;
    }
    this.lastFrameMs = now;
  }

  private followPlane(): void {
    const dir = this.tripLayer.getVehicleDirection();
    if (!dir) return;

    this.followE2.copy(this.followUp).addScaledVector(dir, -this.followUp.dot(dir));
    if (this.followE2.lengthSq() < 1e-6) this.followE2.set(1, 0, 0);
    this.followE2.normalize();
    this.followE1.crossVectors(this.followE2, dir).normalize();
    this.followBasis.makeBasis(this.followE1, this.followE2, dir);
    this.followBasis.transpose();
    this.followTarget.setFromRotationMatrix(this.followBasis);

    if (this.globe.quaternion.angleTo(this.followTarget) > 1e-3) {
      this.globe.quaternion.slerp(this.followTarget, 0.12);
      this.needsRender = true;
    }
  }

  private emitTimeline(sample: ReturnType<typeof sampleTimeline>): void {
    const key = `${sample?.tripIndex ?? -1}:${Math.round(this.timelineT * 200)}:${this.timelinePlaying}:${this.cameraFollow}`;
    if (key === this.lastEmitKey) return;
    this.lastEmitKey = key;

    const tripIndex = sample?.tripIndex ?? null;
    this.onTimeline({
      t: this.timelineT,
      playing: this.timelinePlaying,
      follow: this.cameraFollow,
      tripIndex,
      tripTitle: tripIndex === null ? null : (this.timeline.trips[tripIndex]?.title ?? null),
      currentTime: sample?.currentTime ?? null,
    });
  }

  private attachEvents(): void {
    this.mount.addEventListener('mousedown', this.onDown);
    this.mount.addEventListener('touchstart', this.onDown, { passive: true });
    this.mount.addEventListener('wheel', this.onWheel, { passive: false });
    this.mount.addEventListener('pointerenter', this.onEnter);
    this.mount.addEventListener('pointerleave', this.onLeave);
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('touchmove', this.onMove, { passive: true });
    window.addEventListener('mouseup', this.onUp);
    window.addEventListener('touchend', this.onUp);
  }

  private readonly onEnter = (): void => {
    this.hovering = true;
    this.needsRender = true;
  };

  private readonly onLeave = (): void => {
    this.hovering = false;
    this.needsRender = true;
  };

  private maybeUpgrade(): void {
    if (this.camera.position.z <= HI_RES_ZOOM) this.loadHiRes();
  }

  private loadHiRes(): void {
    if (this.hiResTexture) return;
    this.hiResTexture = new THREE.TextureLoader().load(`${ASSET_PREFIX}/textures/earth-4k.jpg`, (loaded) => {
      if (this.disposed) {
        loaded.dispose();
        return;
      }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = this.maxAnisotropy;
      this.earthMat.map = loaded;
      this.earthMat.needsUpdate = true;
      this.needsRender = true;
    });
  }

  private pickCity(clientX: number, clientY: number): number {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    let best = -1;
    let bestDistance = PIN_HIT_RADIUS;
    for (const pin of this.projections) {
      if (pin.front <= 0.1) continue;
      const distance = Math.hypot(pin.sx - px, pin.sy - py);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = pin.index;
      }
    }
    return best;
  }

  private readonly onDown = (event: MouseEvent | TouchEvent): void => {
    if ('touches' in event && event.touches.length === 2) {
      this.pinching = true;
      this.moved = true;
      this.pinchDist = touchDistance(event.touches);
      return;
    }
    this.dragging = true;
    this.moved = false;
    this.followHintShown = false;
    this.mount.classList.add(this.grabbingClass);
    [this.prevX, this.prevY] = pointerPosition(event);
    [this.downX, this.downY] = [this.prevX, this.prevY];
  };

  private readonly onMove = (event: MouseEvent | TouchEvent): void => {
    if (this.pinching && 'touches' in event && event.touches.length === 2) {
      const next = touchDistance(event.touches);
      this.camera.position.z = clampZoom(this.camera.position.z + (this.pinchDist - next) * 0.01, MIN_ZOOM, MAX_ZOOM);
      this.pinchDist = next;
      this.maybeUpgrade();
      this.needsRender = true;
      return;
    }
    if (!this.dragging) return;
    const [x, y] = pointerPosition(event);
    if (!this.moved && Math.hypot(x - this.downX, y - this.downY) > TAP_SLOP) this.moved = true;
    if (this.moved) {
      if (this.cameraFollow) {
        if (!this.followHintShown) {
          this.followHintShown = true;
          this.onFollowBlocked();
        }
      } else {
        this.velY = (x - this.prevX) * 0.006;
        this.velX = (y - this.prevY) * 0.006;
        this.yaw += this.velY;
        this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch + this.velX));
        this.applyManualRotation();
        this.needsRender = true;
      }
    }
    this.prevX = x;
    this.prevY = y;
  };

  private readonly onUp = (event: MouseEvent | TouchEvent): void => {
    const wasTap = this.dragging && !this.moved;
    this.dragging = false;
    this.pinching = false;
    this.mount.classList.remove(this.grabbingClass);
    if (!wasTap) return;
    this.velX = 0;
    this.velY = 0;
    const point = 'changedTouches' in event ? event.changedTouches[0] : event;
    if (!point) return;
    const picked = this.pickCity(point.clientX, point.clientY);
    this.onSelect(picked >= 0 ? picked : null);
  };

  private readonly onWheel = (event: WheelEvent): void => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    this.camera.position.z = clampZoom(this.camera.position.z + event.deltaY * 0.002, MIN_ZOOM, MAX_ZOOM);
    this.maybeUpgrade();
    this.needsRender = true;
  };

  private readonly onResize = (): void => {
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.needsRender = true;
  };

  private readonly render = (): void => {
    this.advanceTimeline();

    if (!this.cameraFollow && !this.dragging && (Math.abs(this.velX) > 1e-4 || Math.abs(this.velY) > 1e-4)) {
      this.velY *= 0.9;
      this.velX *= 0.9;
      this.yaw += this.velY;
      this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch + this.velX));
      this.applyManualRotation();
      this.needsRender = true;
    } else if (!this.dragging) {
      this.velX = 0;
      this.velY = 0;
    }

    const pinScale = this.camera.position.z / PIN_REF_ZOOM;
    const sample = sampleTimeline(this.timeline, this.timelineT);
    this.tripLayer.setZoomScale(pinScale);
    this.tripLayer.update(sample);

    if (this.cameraFollow) this.followPlane();

    if (this.needsRender) {
      for (let m = 0; m < this.markers.length; m += 1) this.markers[m].scale.setScalar(pinScale);

      this.renderer.render(this.scene, this.camera);

      for (let k = 0; k < this.pinPositions.length; k += 1) {
        this.projected.copy(this.pinPositions[k]).applyQuaternion(this.globe.quaternion);
        const pin = this.projections[k];
        pin.index = k;
        pin.important = tripCities[k].important === true;
        pin.front = this.projected.z;
        this.projected.project(this.camera);
        pin.sx = (this.projected.x * 0.5 + 0.5) * this.width;
        pin.sy = (-this.projected.y * 0.5 + 0.5) * this.height;

        if (!this.sizes[k] || this.sizes[k]?.w === 0) {
          const label = this.labels[k];
          if (label && label.offsetWidth > 0) this.sizes[k] = { w: label.offsetWidth, h: label.offsetHeight };
        }
      }

      layoutLabels(this.projections, this.sizes, this.placed, this.slots);

      for (let k = 0; k < this.labels.length; k += 1) {
        const label = this.labels[k];
        if (!label) continue;
        const slot = this.slots[k];
        if (!slot.visible) {
          label.style.opacity = '0';
          continue;
        }
        label.style.transform = `translate3d(${slot.left}px, ${slot.top}px, 0) translate(-50%, -150%)`;
        label.style.opacity = '1';
      }

      this.emitTimeline(sample);
      this.needsRender = false;
    }

    if (this.running) this.raf = requestAnimationFrame(this.render);
  };
}
