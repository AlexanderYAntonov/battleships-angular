import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

export interface Ship {
  life: number;
  isAlive: boolean;
  size: number;
  shape?: number;
  x: number;
  y: number;
}

export interface Row {
  cells: number[];
}

export interface Playground {
  cells: number[][];
  ships?: Ship[];
  score?: number;
  ships_left?: number;
}

export const CLASSES = {
  sea: 0,
  ship: 1
};

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

  shipsLeft = 10;

  constructor() {
    this.setPlayground();
  }

  ngOnInit() {
    console.log(this.name);

    // this.dataset$ = of(MOCK_DATASET);

    console.table(this.dataset);
  }

  setPlayground() {
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(Math.floor(Math.random() * 2));
      }
      this.dataset.cells.push(row);
    }
  }
}
