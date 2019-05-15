import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FightProcessService } from './services/fight-process.service';
import { PlaygroundService } from './services/playground.service';
import { Playground } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'battleships-angular';
  private canMakeTurn$: Observable<boolean>;
  private subscriptions: Subscription[] = [];
  private started = false;
  private ownPlayground: Playground;
  private enemyPlayground: Playground;

  constructor(
    private fightProcessService: FightProcessService,
    private playgroundService: PlaygroundService
  ) {
    this.canMakeTurn$ = this.fightProcessService.getPermission();
  }

  ngOnInit() {
    this.ownPlayground = this.playgroundService.createPlayground(true);
    this.enemyPlayground = this.playgroundService.createPlayground(false);
  }

  fight() {
    this.started = true;
    this.subscriptions.push(
      this.canMakeTurn$.subscribe(permission => {
        if (permission) {
          this.fightProcessService.makeTurn();
        }
      })
    );
  }
}
