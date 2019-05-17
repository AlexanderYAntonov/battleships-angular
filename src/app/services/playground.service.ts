import { Injectable } from '@angular/core';
import {
  Coordinates,
  Playground,
  BattleShip,
  ATTACK_STATUS,
  PLAYGROUND_STATUS,
  Cell
} from './../model';
import { Ship } from './../ship/ship';

const N = 10;

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {
  private ownPlayground: Playground;
  private enemyPlayground: Playground;
  private fog: number[][];

  constructor() {
    this.ownPlayground = { cells: [] };
    this.enemyPlayground = { cells: [] };
    this.fog = [];
    for (let i = 0; i < N; i++) {
      this.fog[i] = [];
      for (let j = 0; j < N; j++) {
        this.fog[i][j] = 0;
      }
    }
  }

  createPlayground(own: boolean): Playground {
    const playground = own ? this.ownPlayground : this.enemyPlayground;
    playground.cells = this.initCells();
    playground.ships = [];
    playground.score = 0;
    playground.ships_left = 0;
    playground.status = 0;
    return playground;
  }

  resetPlayground(own: boolean): Playground {
    const playground = this.createPlayground(own);
    playground.ships_left = this.setShips(playground);
    return playground;
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

  finishGame(playgroundWin: Playground, playgroundLose: Playground) {
    playgroundLose.status = 2;
    playgroundWin.status = 1;
  }

  lose(playground: Playground) {
    playground.status = PLAYGROUND_STATUS.lose;
  }

  win(playground: Playground) {
    playground.status = PLAYGROUND_STATUS.win;
  }

  markShipAsDead(playground: Playground, shipID: number) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (playground.cells[i][j].value % 100 === shipID) {
          playground.cells[i][j].value = 200 + shipID;
        }
      }
    }
  }

  underAttack(playground: Playground, coords: Coordinates): number {
    const cellValue = playground.cells[coords.x][coords.y].value;
    if (cellValue >= 10 && cellValue < 100) {
      // identify ship id
      const shipID = cellValue - 10;
      // hurt ship
      const ship = playground.ships[shipID];
      ship.life--;
      // check if ship was destroyed
      if (ship.life === 0) {
        // - destroy ship
        ship.alive = false;
        // - decrease ShipsLeft
        playground.ships_left--;
        // - mark ship as dead in cells
        this.markShipAsDead(playground, shipID + 10);
        this.changeCellValue(playground, coords, 1000);
        // - check if ships count === 0
        if (playground.ships_left === 0) {
          return ATTACK_STATUS.lose;
        }
        return ATTACK_STATUS.destroyed;
      }

      // result = Wounded
      // change cell value
      this.changeCellValue(playground, coords, 1100);
      // report Result

      return ATTACK_STATUS.wounded;
    }
    if (cellValue === 0) {
      this.changeCellValue(playground, coords, 1100);
      return ATTACK_STATUS.missed;
    }

    // if it is not a ship and not a water - we already shoot here
    return ATTACK_STATUS.duplicate;
  }

  clearPreviousTarget(playground: Playground) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (playground.cells[i][j].value >= 1000) {
          playground.cells[i][j].value -= 1000;
        }
      }
    }
  }

  changeCellValue(playground: Playground, coords: Coordinates, delta: number) {
    this.clearPreviousTarget(playground);

    playground.cells[coords.x][coords.y].value += delta;
  }

  checkNearArea(x: number, y: number, cells: Cell[][]): boolean {
    const xMin = x > 0 ? x - 1 : x;
    const xMax = x < N - 1 ? x + 1 : x;
    const yMin = y > 0 ? y - 1 : y;
    const yMax = y < N - 1 ? y + 1 : y;

    for (let i = xMin; i <= xMax; i++) {
      for (let j = yMin; j <= yMax; j++) {
        if (cells[i][j].value !== 0) {
          return false;
        }
      }
    }
    return true;
  }

  check(size: number, angle: number, x: number, y: number, cells: Cell[][]) {
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

  checkPlace(ship: Ship, x: number, y: number, cells: Cell[][]): boolean {
    const size = ship.getSize();
    const angle = ship.getAngle();
    return this.check(size, angle, x, y, cells);
  }

  calcGoodCoordinates(cells: Cell[][], ship: Ship): Coordinates {
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

  placeShip(cells: Cell[][], ship: Ship, coords: Coordinates) {
    const size = ship.getSize();
    const angle = ship.getAngle();
    for (let i = 0; i < size; i++) {
      if (angle === 0 || angle === 180) {
        cells[coords.x + i][coords.y].value = ship.getId();
      } else {
        cells[coords.x][coords.y + i].value = ship.getId();
      }
    }
  }

  createShips(
    cells: Cell[][],
    ships: BattleShip[],
    count: number,
    size: number,
    rotatable: boolean,
    id: number
  ): number {
    for (let i = 0; i < count; i++) {
      const ship = new Ship(size, id);
      const times = Math.floor(Math.random() * 4);
      if (rotatable) {
        ship.rotateShip(times);
      }
      const coords = this.calcGoodCoordinates(cells, ship);
      ship.placeShip(coords);
      this.placeShip(cells, ship, coords);
      ships.push({ id, life: size, size, alive: true });
      id++;
    }
    return id;
  }

  setShips(playground: Playground): number {
    let id = 10;
    const cells = playground.cells;
    const ships = playground.ships;
    id = this.createShips(cells, ships, 3, 3, true, id);
    id = this.createShips(cells, ships, 4, 2, true, id);
    id = this.createShips(cells, ships, 5, 1, false, id);
    return 3 + 4 + 5;
  }

  initCells(): Cell[][] {
    const cells: Cell[][] = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        const c = new Cell(i, j);
        c.value = 0;
        row.push(c);
      }
      cells.push(row);
    }
    return cells;
  }

  setCells(playground: Playground, cells: Cell[][]): Playground {
    playground.cells = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(cells[i][j]);
      }
      playground.cells.push(row);
    }
    return playground;
  }

  updateCell(playground: Playground, coords: Coordinates, value: number) {
    playground.cells[coords.x][coords.y].value = value;
  }
}
