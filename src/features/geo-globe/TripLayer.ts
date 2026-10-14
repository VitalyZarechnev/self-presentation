import * as THREE from 'three';

import { TTimelineSample } from '@domain/geo/timeline';
import { TResolvedTrip, TTransport } from '@domain/geo/trips';

import { toVec } from './globeMath';
import { TransportModel } from './transportModel';
import { arcPoints, sampleArc } from './tripArc';

const ARC_SEGMENTS = 48;
const CAR_DASH = 0.018;
const CAR_GAP = 0.012;

function segmentTransport(transports: readonly TTransport[], segmentIndex: number): TTransport {
  return transports[segmentIndex + 1];
}

export class TripLayer {
  private readonly parent: THREE.Group;
  private readonly radius: number;
  private readonly cityVectors: THREE.Vector3[][];
  private readonly transports: TTransport[][];

  private readonly solidMaterial: THREE.LineBasicMaterial;
  private readonly dashedMaterial: THREE.LineDashedMaterial;
  private lines: THREE.Line[] = [];
  private readonly models: Record<TTransport, TransportModel>;

  private readonly normal = new THREE.Vector3();
  private activeTrip = -1;
  private vehicleVisible = false;

  constructor(parent: THREE.Group, radius: number, trips: readonly TResolvedTrip[], color: string, assetPrefix: string) {
    this.parent = parent;
    this.radius = radius;

    this.cityVectors = trips.map((trip) => trip.waypoints.map((waypoint) => toVec(waypoint.city.lat, waypoint.city.lon, radius)));
    this.transports = trips.map((trip) => trip.waypoints.map((waypoint) => waypoint.transport));

    this.solidMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 });
    this.dashedMaterial = new THREE.LineDashedMaterial({ color, transparent: true, opacity: 0.9, dashSize: CAR_DASH, gapSize: CAR_GAP });

    this.models = {
      airplane: new TransportModel(assetPrefix, 'airplane'),
      car: new TransportModel(assetPrefix, 'car'),
    };
    this.parent.add(this.models.airplane.object);
    this.parent.add(this.models.car.object);
  }

  private clearLines(): void {
    for (const line of this.lines) {
      this.parent.remove(line);
      line.geometry.dispose();
    }
    this.lines = [];
  }

  private buildTripLine(tripIndex: number): void {
    this.clearLines();
    const cities = this.cityVectors[tripIndex];
    const transports = this.transports[tripIndex];

    for (let s = 0; s < cities.length - 1; s += 1) {
      const isCar = segmentTransport(transports, s) === 'car';
      const points = arcPoints(cities[s], cities[s + 1], this.radius, ARC_SEGMENTS, isCar ? 0 : undefined);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, isCar ? this.dashedMaterial : this.solidMaterial);
      if (isCar) line.computeLineDistances();
      this.parent.add(line);
      this.lines.push(line);
    }
  }

  setColor(color: string): void {
    this.solidMaterial.color.set(color);
    this.dashedMaterial.color.set(color);
  }

  setZoomScale(scale: number): void {
    this.models.airplane.setScale(scale);
    this.models.car.setScale(scale);
  }

  private hideModels(): void {
    this.models.airplane.setVisible(false);
    this.models.car.setVisible(false);
  }

  update(sample: TTimelineSample | null): void {
    if (!sample) {
      this.clearLines();
      this.hideModels();
      this.activeTrip = -1;
      this.vehicleVisible = false;
      return;
    }

    if (sample.tripIndex !== this.activeTrip) {
      this.buildTripLine(sample.tripIndex);
      this.activeTrip = sample.tripIndex;
    }

    const transport = segmentTransport(this.transports[sample.tripIndex], sample.segmentIndex);
    const cities = this.cityVectors[sample.tripIndex];
    const from = cities[sample.segmentIndex];
    const to = cities[sample.segmentIndex + 1];
    const { position, tangent } = sampleArc(from, to, this.radius, sample.segmentProgress, transport === 'car' ? 0 : undefined);
    this.normal.copy(position).normalize();

    this.models.airplane.setVisible(transport === 'airplane');
    this.models.car.setVisible(transport === 'car');
    this.models[transport].orient(position, tangent, this.normal);
    this.vehicleVisible = true;
  }

  getVehicleDirection(): THREE.Vector3 | null {
    return this.vehicleVisible ? this.normal : null;
  }

  dispose(): void {
    this.clearLines();
    this.solidMaterial.dispose();
    this.dashedMaterial.dispose();
    this.parent.remove(this.models.airplane.object);
    this.parent.remove(this.models.car.object);
    this.models.airplane.dispose();
    this.models.car.dispose();
  }
}
