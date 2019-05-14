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

  checkPlace(ship: Ship, x: number, y: number, cells: number[][]): boolean {
    const size = ship.getSize();
    const angle = ship.getAngle();
    if (size === 1) {
      // dot ship
      return this.checkNearArea(x, y, cells);
    }
    if (size === 2) {
      if (ship.getAngle() === 0 || ship.getAngle() === 0) {
        return (
          x < N - 1 &&
          this.checkNearArea(x, y, cells) &&
          this.checkNearArea(x + 1, y, cells)
        );
      } else {
        return (
          y < N - 1 &&
          this.checkNearArea(x, y, cells) &&
          this.checkNearArea(x, y + 1, cells)
        );
      }
    }
    return true;
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
      // console.log(`checked ${x} ${y} with res ${placeOK}`);
    }
    console.log(`checked ${x} ${y} with res ${placeOK}`);
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

  setShips() {
    for (let i = 0; i < 5; i++) {
      const ship1 = new Ship(1);
      const coords = this.calcGoodCoordinates(ship1);
      ship1.placeShip(coords);
      this.placeShip(ship1, coords);
      this.ships.push(ship1);
    }
    for (let i = 0; i < 4; i++) {
      const ship2 = new Ship(2);
      const times = Math.floor(Math.random() * 4);
      ship2.rotateShip(times);
      const coords = this.calcGoodCoordinates(ship2);
      ship2.placeShip(coords);
      this.placeShip(ship2, coords);
      this.ships.push(ship2);
    }
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
