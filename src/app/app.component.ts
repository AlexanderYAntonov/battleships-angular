import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FightProcessService } from './services/fight-process.service';
import { PlaygroundService } from './services/playground.service';
import { Playground, Coordinates } from './model';

const N = 10;

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
  private fog: number[][];
  private emptyFog: number[][];
  private ownHadShoots = 0;
  private enemyHadShoots = 0;

  constructor(
    private fightProcessService: FightProcessService,
    private playgroundService: PlaygroundService
  ) {
    this.canMakeTurn$ = this.fightProcessService.getPermission();
  }

  ngOnInit() {
    this.fog = this.playgroundService.getFog();
    this.emptyFog = this.playgroundService.getEmptyFog();
    this.ownPlayground = this.playgroundService.createPlayground(true);
    this.enemyPlayground = this.playgroundService.createPlayground(false);
  }

  fight() {
    this.started = true;
    /*this.subscriptions.push(
      this.canMakeTurn$.subscribe(permission => {
        if (permission) {
          this.fightProcessService.makeTurn();
        }
      })
    );*/
    this.fightProcessService.makeTurn();
  }

  getRandomCoords(): Coordinates {
    const x = Math.floor(Math.random() * N);
    const y = Math.floor(Math.random() * N);
    return { x, y };
  }

  underAttack(own: boolean) {
    const coords = this.getRandomCoords();
    if (own) {
      console.log(`We're under attack!`);
      this.playgroundService.underAttack(this.ownPlayground, coords);
      this.ownHadShoots++;
    } else {
      console.log(`Enemy is under attack!`);
      const result = this.playgroundService.underAttack(
        this.enemyPlayground,
        coords
      );
      this.playgroundService.clearFog(coords);
      this.enemyHadShoots++;
    }
  }
}
