import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FightProcessService } from './services/fight-process.service';
import { PlaygroundService } from './services/playground.service';
import { Playground, Coordinates, ATTACK_STATUS } from './model';

const N = 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private canMakeTurn$: Observable<boolean>;
  private subscriptions: Subscription[] = [];
  private started = false;
  private ownPlayground: Playground;
  private enemyPlayground: Playground;
  private fog: number[][];
  private emptyFog: number[][];
  private ownHadShoots = 0;
  private enemyHadShoots = 0;

  constructor(
    private fightProcessService: FightProcessService,
    private playgroundService: PlaygroundService
  ) {
    // this.canMakeTurn$ = this.fightProcessService.getPermission();
  }

  ngOnInit() {
    this.fog = this.playgroundService.getFog();
    this.emptyFog = this.playgroundService.getEmptyFog();
    this.ownPlayground = this.playgroundService.createPlayground(true);
    this.enemyPlayground = this.playgroundService.createPlayground(false);
  }

  fight() {
    this.started = true;
    this.ownPlayground = this.playgroundService.resetPlayground(true);
    this.enemyPlayground = this.playgroundService.resetPlayground(false);
    /*this.subscriptions.push(
      this.canMakeTurn$.subscribe(permission => {
        if (permission) {
          this.fightProcessService.makeTurn();
        }
      })
    );*/
    // this.fightProcessService.makeTurn();
  }

  getRandomCoords(): Coordinates {
    const x = Math.floor(Math.random() * N);
    const y = Math.floor(Math.random() * N);
    return { x, y };
  }

  underAttack(own: boolean, coords: Coordinates) {
    if (this.started) {
      const playground = own ? this.ownPlayground : this.enemyPlayground;
      const result = this.playgroundService.underAttack(playground, coords);
      if (result === ATTACK_STATUS.lose) {
        const playgroundWin = !own ? this.ownPlayground : this.enemyPlayground;
        this.playgroundService.finishGame(playgroundWin, playground);
        this.started = false;
      }
    }
  }
}
