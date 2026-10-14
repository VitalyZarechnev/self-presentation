import * as THREE from 'three';

const BASE_OFFSET = 1.025;
const LIFT_PER_RAD = 0.12;
const MIN_LIFT = 0.012;
const MAX_LIFT = 0.24;

function angleBetween(a: THREE.Vector3, b: THREE.Vector3): number {
  return Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1));
}

function peakLift(a: THREE.Vector3, b: THREE.Vector3): number {
  return THREE.MathUtils.clamp(LIFT_PER_RAD * angleBetween(a, b), MIN_LIFT, MAX_LIFT);
}

function slerpUnit(from: THREE.Vector3, to: THREE.Vector3, p: number, out: THREE.Vector3): THREE.Vector3 {
  const dot = THREE.MathUtils.clamp(from.dot(to), -1, 1);
  const omega = Math.acos(dot);
  const sin = Math.sin(omega);

  if (sin < 1e-6) {
    return out.copy(from).lerp(to, p).normalize();
  }

  const a = Math.sin((1 - p) * omega) / sin;
  const b = Math.sin(p * omega) / sin;
  return out.set(from.x * a + to.x * b, from.y * a + to.y * b, from.z * a + to.z * b).normalize();
}

function liftAt(p: number, lift: number): number {
  const s = Math.sin(Math.PI * p);
  return BASE_OFFSET + lift * s * s;
}

export function arcPoints(from: THREE.Vector3, to: THREE.Vector3, radius: number, segments: number, lift?: number): THREE.Vector3[] {
  const a = from.clone().normalize();
  const b = to.clone().normalize();
  const peak = lift ?? peakLift(a, b);
  const points: THREE.Vector3[] = [];
  const dir = new THREE.Vector3();

  for (let i = 0; i <= segments; i += 1) {
    const p = i / segments;
    slerpUnit(a, b, p, dir);
    points.push(dir.clone().multiplyScalar(radius * liftAt(p, peak)));
  }

  return points;
}

export type TArcSample = {
  position: THREE.Vector3;
  tangent: THREE.Vector3;
};

const tmpDir = new THREE.Vector3();
const tmpAhead = new THREE.Vector3();

export function sampleArc(from: THREE.Vector3, to: THREE.Vector3, radius: number, p: number, lift?: number): TArcSample {
  const a = from.clone().normalize();
  const b = to.clone().normalize();
  const peak = lift ?? peakLift(a, b);

  const clamped = THREE.MathUtils.clamp(p, 0, 1);
  slerpUnit(a, b, clamped, tmpDir);
  const position = tmpDir.clone().multiplyScalar(radius * liftAt(clamped, peak));

  const eps = 1e-3;
  const ahead = Math.min(1, clamped + eps);
  const behind = Math.max(0, clamped - eps);
  slerpUnit(a, b, ahead, tmpDir);
  const front = tmpDir.clone().multiplyScalar(radius * liftAt(ahead, peak));
  slerpUnit(a, b, behind, tmpAhead);
  const back = tmpAhead.clone().multiplyScalar(radius * liftAt(behind, peak));

  const tangent = front.sub(back).normalize();
  return { position, tangent };
}
