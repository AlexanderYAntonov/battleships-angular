import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { Ship } from './../ship/ship';
import { Coordinates, Playground } from './../model';

const N = 10;

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  @Input() name: string;
  @Input() id: number;

  dataset$: Observable<Playground>;
  dataset: Playground = {
    cells: [],
    score: 0
  };

  ships: Ship[];

  shipsLeft = 0;

  constructor() {
    this.ships = [];
    this.setPlayground();
  }

  ngOnInit() {
    this.setShips();
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

  calcGoodCoordinates(ship: Ship): Coordinates {
    let placeOK = false;
    let x = 0;
    let y = 0;
    while (!placeOK) {
      const rand = Math.random();
      x = Math.floor(rand * N);
      y = Math.floor(Math.random() * N);
      placeOK = this.checkPlace(ship, x, y, this.dataset.cells);
    }
    return { x, y };
  }

  placeShip(ship: Ship, coords: Coordinates) {
    const size = ship.getSize();
    const angle = ship.getAngle();
    for (let i = 0; i < size; i++) {
      if (angle === 0 || angle === 180) {
        this.dataset.cells[coords.x + i][coords.y] = 1;
      } else {
        this.dataset.cells[coords.x][coords.y + i] = 1;
      }
    }
    this.shipsLeft++;
  }

  createShips(count: number, size: number, rotatable: boolean) {
    for (let i = 0; i < count; i++) {
      const ship = new Ship(size);
      const times = Math.floor(Math.random() * 4);
      ship.rotateShip(times);
      const coords = this.calcGoodCoordinates(ship);
      ship.placeShip(coords);
      this.placeShip(ship, coords);
      this.ships.push(ship);
    }
  }

  setShips() {
    this.createShips(3, 3, true);
    this.createShips(4, 2, true);
    this.createShips(5, 1, false);
  }

  setPlayground() {
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(0);
      }
      this.dataset.cells.push(row);
    }
  }
}
