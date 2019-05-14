import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Coordinates } from './../model';

const N = 10;

@Injectable({
  providedIn: 'root'
})
export class FightProcessService {
  private canMakeTurn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private shootCoords$: Subject<Coordinates> = new Subject();
  constructor() {
    console.log(`this can make set new`);
    console.log(this.canMakeTurn$);
    setTimeout(this.grantPermission, 5000);
  }

  getPermission(): Observable<boolean> {
    return this.canMakeTurn$.asObservable();
  }

  grantPermission() {
    if (this.canMakeTurn$) {
      this.canMakeTurn$.next(true);
    } else {
      console.log(`can make turn is undef`);
      console.log(this.canMakeTurn$);
    }
  }

  denyPermission() {
    this.canMakeTurn$.next(false);
  }

  makeTurn() {
    const x = Math.floor(Math.random() * N);
    const y = Math.floor(Math.random() * N);
    this.shootCoords$.next({ x, y });
    console.log(`going to shoot into ${x} ${y}`);
  }
}
