import * as THREE from 'three';

import { tripCities } from '@domain/geo/tripCities';

import { clampZoom, pointerPosition, touchDistance, toVec } from './globeMath';
import { LabelSize, LabelSlot, layoutLabels, PinProjection, PlacedBox } from './labelLayout';

const RADIUS = 1.55;
const MIN_ZOOM = 2.3;
const MAX_ZOOM = 5.2;
const HI_RES_ZOOM = 3.4;
const PIN_REF_ZOOM = 4.4;
const PIN_HIT_RADIUS = 22;
const TAP_SLOP = 6;

const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export type GeoGlobeOptions = {
  mount: HTMLElement;
  labels: readonly (HTMLElement | null)[];
  reduceMotion: boolean;
  pinColor: string;
  grabbingClass: string;
  onSelect: (index: number | null) => void;
};

export class GeoGlobeController {
  private readonly mount: HTMLElement;
  private readonly labels: readonly (HTMLElement | null)[];
  private readonly reduceMotion: boolean;
  private readonly grabbingClass: string;
  private readonly onSelect: (index: number | null) => void;

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
    this.reduceMotion = options.reduceMotion;
    this.grabbingClass = options.grabbingClass;
    this.onSelect = options.onSelect;

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
    this.needsRender = true;
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
    this.velY = (x - this.prevX) * 0.006;
    this.velX = (y - this.prevY) * 0.006;
    this.globe.rotation.y += this.velY;
    this.globe.rotation.x = Math.max(-1.2, Math.min(1.2, this.globe.rotation.x + this.velX));
    this.prevX = x;
    this.prevY = y;
    this.needsRender = true;
  };

  private readonly onUp = (event: MouseEvent | TouchEvent): void => {
    const wasTap = this.dragging && !this.moved;
    this.dragging = false;
    this.pinching = false;
    this.mount.classList.remove(this.grabbingClass);
    if (!wasTap) return;
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
    const autoRotating = !this.dragging && !this.hovering && this.selected === null;
    if (autoRotating) {
      if (!this.reduceMotion) {
        this.globe.rotation.y += 0.0022;
      } else {
        this.velY *= 0.94;
        this.velX *= 0.94;
        this.globe.rotation.y += this.velY;
        this.globe.rotation.x += this.velX;
      }
      this.needsRender = true;
    }

    if (this.needsRender) {
      const pinScale = this.camera.position.z / PIN_REF_ZOOM;
      for (let m = 0; m < this.markers.length; m += 1) this.markers[m].scale.setScalar(pinScale);

      this.renderer.render(this.scene, this.camera);

      for (let k = 0; k < this.pinPositions.length; k += 1) {
        this.projected.copy(this.pinPositions[k]).applyEuler(this.globe.rotation);
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
        label.style.left = `${slot.left}px`;
        label.style.top = `${slot.top}px`;
        label.style.opacity = '1';
      }

      this.needsRender = false;
    }

    if (this.running) this.raf = requestAnimationFrame(this.render);
  };
}
