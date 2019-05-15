import { Component, OnInit, Input } from '@angular/core';
import { Playground } from './../model';

const N = 10;

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  @Input() name: string;
  @Input() playground: Playground;
  @Input() own: boolean;

  // dataset$: Observable<Playground>;

  constructor() {}

  ngOnInit() {}
}
