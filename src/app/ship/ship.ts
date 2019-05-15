import { Coordinates } from './../model';

export class Ship {
  private isAlive: boolean;
  private lifeAmount: number;
  private x: number;
  private y: number;
  private angle: number;

  constructor(private size: number, private id: number) {
    this.isAlive = true;
    this.lifeAmount = size;
    this.angle = 0;
  }

  getId(): number {
    return this.id;
  }

  destroyShip() {
    this.isAlive = false;
  }

  woundShip() {
    this.lifeAmount--;
    if (this.lifeAmount === 0) {
      this.destroyShip();
    }
  }

  pingShip(): boolean {
    return this.isAlive;
  }

  placeShip(coordinates: Coordinates) {
    this.x = coordinates.x;
    this.y = coordinates.y;
  }

  rotateShip(times: number): number {
    this.angle += 90 * times;
    if (this.angle === 360) {
      this.angle = 0;
    }
    return this.angle;
  }

  getSize(): number {
    return this.size;
  }

  getAngle(): number {
    return this.angle;
  }
}
