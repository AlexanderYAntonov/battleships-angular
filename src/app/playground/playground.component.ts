import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Playground, PLAYGROUND_STATUS, CELL_VALUES } from './../model';

const N = 10;

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() playground: Playground;
  @Input() own: boolean;
  @Input() fog: number[][];
  @Input() hadShoots: number;

  private PLGRstatus = PLAYGROUND_STATUS;
  private cellValues = CELL_VALUES;
  private cells: number[][];

  // dataset$: Observable<Playground>;

  constructor() {
    this.cells = [];
    for (let i = 0; i < N; i++) {
      this.cells[i] = [];
      for (let j = 0; j < N; j++) {
        this.cells[i][j] = 3;
      }
    }
  }

  ngOnInit() {}

  applyFog() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        this.cells[i][j] = this.fog[i][j] ? this.playground.cells[i][j] : 3;
      }
    }
  }

  ngOnChanges() {
    if (this.cells) {
      this.applyFog();
    }
  }
}
