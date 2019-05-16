import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {Playground, PLAYGROUND_STATUS, CELL_VALUES, Cell} from './../model';

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
  private cells: Cell[][];

  // dataset$: Observable<Playground>;

  constructor() {
    this.cells = [];
    for (let i = 0; i < N; i++) {
      this.cells[i] = [];
      for (let j = 0; j < N; j++) {
        let c = new Cell(i, j);
        c.value = 3;
        this.cells[i][j] = c;
      }
    }
  }

  ngOnInit() {}

  applyFog() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        this.cells[i][j].value = this.fog[i][j] ? this.playground.cells[i][j].value : 3;
      }
    }
  }

  ngOnChanges() {
    if (this.cells) {
      this.applyFog();
    }
  }
}
