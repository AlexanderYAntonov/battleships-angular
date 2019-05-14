import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FightProcessService } from './services/fight-process.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'battleships-angular';
  private canMakeTurn$: Observable<boolean>;
  private subscriptions: Subscription[] = [];
  private started = false;

  constructor(private fightProcessService: FightProcessService) {
    this.canMakeTurn$ = this.fightProcessService.getPermission();
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
