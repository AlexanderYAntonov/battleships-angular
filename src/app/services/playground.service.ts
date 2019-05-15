import { Injectable } from '@angular/core';
import { Coordinates, Playground } from './../model';
import { Ship } from './../ship/ship';

const N = 10;
const ATTACK_STATUS = { missed: 0, wounded: 1, killed: 2 };

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {
  private ownPlayground: Playground;
  private enemyPlayground: Playground;
  private ownShips: Ship[];
  private enemyShips: Ship[];
  private fog: number[][];

  constructor() {
    this.ownShips = [];
    this.enemyShips = [];
    this.ownPlayground = { cells: [] };
    this.enemyPlayground = { cells: [] };
    this.fog = [];
    for (let i = 0; i < N; i++) {
      this.fog[i] = [];
      for (let j = 0; j < N; j++) {
        this.fog[i][j] = 0;
      }
    }
    console.table(this.fog);
  }

  getFog() {
    return this.fog;
  }

  getEmptyFog(): number[][] {
    const emptyFog = [];
    for (let i = 0; i < N; i++) {
      emptyFog[i] = [];
      for (let j = 0; j < N; j++) {
        emptyFog[i][j] = 1;
      }
    }
    return emptyFog;
  }

  clearFog(coords: Coordinates) {
    this.fog[coords.x][coords.y] = 1;
    console.log(`fog cleared`);
  }

  underAttack(playground: Playground, coords: Coordinates): number {
    if (playground.cells[coords.x][coords.y] === 1) {
      this.hurt(playground, coords);
      return ATTACK_STATUS.wounded;
    }
    console.log(`missed!`);
    return ATTACK_STATUS.missed;
  }

  hurt(playground: Playground, coords: Coordinates) {
    playground.cells[coords.x][coords.y] = 2;
    console.log(`Ouch!`);
  }

  createPlayground(own: boolean): Playground {
    const playground = own ? this.ownPlayground : this.enemyPlayground;
    const ships = own ? this.ownShips : this.enemyShips;
    playground.cells = this.initCells();
    playground.score = 0;
    playground.ships_left = this.setShips(playground.cells, ships);
    return playground;
  }

  checkNearArea(x: number, y: number, cells: number[][]): boolean {
    const xMin = x > 0 ? x - 1 : x;
    const xMax = x < N - 1 ? x + 1 : x;
    const yMin = y > 0 ? y - 1 : y;
    const yMax = y < N - 1 ? y + 1 : y;

    for (let i = xMin; i <= xMax; i++) {
      for (let j = yMin; j <= yMax; j++) {
        if (cells[i][j] !== 0) {
          return false;
        }
      }
    }
    return true;
  }

  check(size: number, angle: number, x: number, y: number, cells: number[][]) {
    if (angle === 0 || angle === 180) {
      if (x >= N - size + 1) {
        return false;
      }
      for (let i = 0; i < size; i++) {
        if (this.checkNearArea(x + i, y, cells) === false) {
          return false;
        }
      }
    } else {
      if (y >= N - size + 1) {
        return false;
      }
      for (let i = 0; i < size; i++) {
        if (this.checkNearArea(x, y + i, cells) === false) {
          return false;
        }
      }
    }
    return true;
  }

  checkPlace(ship: Ship, x: number, y: number, cells: number[][]): boolean {
    const size = ship.getSize();
    const angle = ship.getAngle();
    return this.check(size, angle, x, y, cells);
  }

  calcGoodCoordinates(cells: number[][], ship: Ship): Coordinates {
    let placeOK = false;
    let x = 0;
    let y = 0;
    while (!placeOK) {
      x = Math.floor(Math.random() * N);
      y = Math.floor(Math.random() * N);
      placeOK = this.checkPlace(ship, x, y, cells);
    }
    return { x, y };
  }

  placeShip(cells: number[][], ship: Ship, coords: Coordinates) {
    const size = ship.getSize();
    const angle = ship.getAngle();
    for (let i = 0; i < size; i++) {
      if (angle === 0 || angle === 180) {
        cells[coords.x + i][coords.y] = ship.getId();
      } else {
        cells[coords.x][coords.y + i] = ship.getId();
      }
    }
    // this.shipsLeft++;
  }

  createShips(
    cells: number[][],
    ships: Ship[],
    count: number,
    size: number,
    rotatable: boolean,
    id: number
  ): number {
    for (let i = 0; i < count; i++) {
      const ship = new Ship(size, id);
      id++;
      const times = Math.floor(Math.random() * 4);
      ship.rotateShip(times);
      const coords = this.calcGoodCoordinates(cells, ship);
      ship.placeShip(coords);
      this.placeShip(cells, ship, coords);
      ships.push(ship);
      console.log(`id = ${id}`);
    }
    return id;
  }

  setShips(cells: number[][], ships: Ship[]): number {
    let id = 10;
    id = this.createShips(cells, ships, 3, 3, true, id);
    id = this.createShips(cells, ships, 4, 2, true, id);
    id = this.createShips(cells, ships, 5, 1, false, id);
    return 3 + 4 + 5;
  }

  initCells(): number[][] {
    const cells = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(0);
      }
      cells.push(row);
    }
    return cells;
  }
}
