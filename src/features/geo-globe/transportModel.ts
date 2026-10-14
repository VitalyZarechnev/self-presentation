import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { TTransport } from '@domain/geo/trips';

type TTransportConfig = {
  url: string;
  rotation: readonly [number, number, number];
  baseScale: number;
  buildFallback: () => THREE.Group;
};

function buildProceduralPlane(): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: '#f4f4f5', metalness: 0.1, roughness: 0.6 });
  const accent = new THREE.MeshStandardMaterial({ color: '#d64545', metalness: 0.1, roughness: 0.6 });

  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.6, 4, 8), body);
  fuselage.rotation.z = Math.PI / 2;
  group.add(fuselage);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 8), body);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = 0.45;
  group.add(nose);

  const wings = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.95), accent);
  group.add(wings);

  const tailWing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.4), accent);
  tailWing.position.x = -0.42;
  group.add(tailWing);

  const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.03), accent);
  tailFin.position.set(-0.42, 0.12, 0);
  group.add(tailFin);

  return group;
}

function buildProceduralCar(): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: '#3f7bd6', metalness: 0.1, roughness: 0.6 });
  const cabin = new THREE.MeshStandardMaterial({ color: '#d7e4f7', metalness: 0.1, roughness: 0.5 });
  const wheel = new THREE.MeshStandardMaterial({ color: '#1b1b1f', metalness: 0.1, roughness: 0.8 });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.42), body);
  chassis.position.y = 0.16;
  group.add(chassis);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.38), cabin);
  roof.position.set(-0.02, 0.36, 0);
  group.add(roof);

  const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12);
  const offsets: readonly [number, number][] = [
    [0.28, 0.25],
    [0.28, -0.25],
    [-0.28, 0.25],
    [-0.28, -0.25],
  ];
  for (const [x, z] of offsets) {
    const w = new THREE.Mesh(wheelGeo, wheel);
    w.rotation.x = Math.PI / 2;
    w.position.set(x, 0.06, z);
    group.add(w);
  }

  return group;
}

const CONFIG: Record<TTransport, TTransportConfig> = {
  airplane: { url: 'models/plane.glb', rotation: [0, Math.PI / 2, 0], baseScale: 0.14, buildFallback: buildProceduralPlane },
  car: { url: 'models/car.glb', rotation: [0, Math.PI / 2, 0], baseScale: 0.12, buildFallback: buildProceduralCar },
};

export class TransportModel {
  readonly object: THREE.Group;
  private model: THREE.Object3D;
  private readonly config: TTransportConfig;
  private disposed = false;

  private readonly xAxis = new THREE.Vector3();
  private readonly yAxis = new THREE.Vector3();
  private readonly zAxis = new THREE.Vector3();
  private readonly basis = new THREE.Matrix4();

  constructor(assetPrefix: string, kind: TTransport) {
    this.config = CONFIG[kind];
    this.object = new THREE.Group();
    this.object.visible = false;
    this.object.scale.setScalar(this.config.baseScale);

    this.model = this.config.buildFallback();
    this.object.add(this.model);

    this.tryLoadGltf(assetPrefix);
  }

  private tryLoadGltf(assetPrefix: string): void {
    const url = `${assetPrefix}/${this.config.url}`;
    new GLTFLoader().load(
      url,
      (gltf) => {
        if (this.disposed) return;
        const scene = gltf.scene;
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        scene.scale.setScalar(1 / maxDim);
        box.setFromObject(scene);
        box.getCenter(scene.position).multiplyScalar(-1);

        const oriented = new THREE.Group();
        oriented.add(scene);
        oriented.rotation.set(this.config.rotation[0], this.config.rotation[1], this.config.rotation[2]);

        this.object.remove(this.model);
        this.model = oriented;
        this.object.add(oriented);
      },
      undefined,
      () => {},
    );
  }

  setScale(scale: number): void {
    this.object.scale.setScalar(this.config.baseScale * scale);
  }

  setVisible(visible: boolean): void {
    this.object.visible = visible;
  }

  orient(position: THREE.Vector3, tangent: THREE.Vector3, surfaceNormal: THREE.Vector3): void {
    this.object.position.copy(position);

    this.xAxis.copy(tangent).normalize();
    this.yAxis.copy(surfaceNormal).normalize();
    this.zAxis.crossVectors(this.xAxis, this.yAxis).normalize();
    this.yAxis.crossVectors(this.zAxis, this.xAxis).normalize();

    this.basis.makeBasis(this.xAxis, this.yAxis, this.zAxis);
    this.object.quaternion.setFromRotationMatrix(this.basis);
  }

  dispose(): void {
    this.disposed = true;
    this.object.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose();
        const material = node.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material.dispose();
      }
    });
  }
}
