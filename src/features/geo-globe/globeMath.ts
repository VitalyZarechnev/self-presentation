import * as THREE from 'three';

const D2R = Math.PI / 180;

export function toVec(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * D2R;
  const theta = (lon + 180) * D2R;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

export function clampZoom(z: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, z));
}

export function touchDistance(touches: TouchList): number {
  return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
}

export function pointerPosition(event: MouseEvent | TouchEvent): [number, number] {
  const point = 'touches' in event ? event.touches[0] : event;
  return [point.clientX, point.clientY];
}
