import { Component, OnInit } from '@angular/core';
import { PlaygroundService } from './services/playground.service';
import {
  Playground,
  Coordinates,
  ATTACK_STATUS,
  WebSocketIncomingMessage,
  WebSocketOutgoingMessage, InitialRequest
} from './model';
import {WsService} from './services/ws.service';

const N = 10;

const url = 'ws://localhost:8081/ws';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private notReady = true;
  private started = false;
  private ownPlayground: Playground;
  private enemyPlayground: Playground;
  private fog: number[][];
  private emptyFog: number[][];
  private ownHadShoots = 0;
  private enemyHadShoots = 0;
  private nameOwn = 'Команда А';
  private nameEnemy = 'Команда Б';

  private enemyReady = false;
  private nameReady = false;

  private socket: any;
  private startMessage: WebSocketOutgoingMessage = { started: true };

  constructor(private playgroundService: PlaygroundService, private ws: WsService) {}



  ngOnInit() {


    this.fog = this.playgroundService.getFog();
    this.emptyFog = this.playgroundService.getEmptyFog();
    this.ownPlayground = this.playgroundService.createPlayground(true);
    this.enemyPlayground = this.playgroundService.createPlayground(false);

    this.ws.getObserver().subscribe( o => {
        console.log(o);
        this.onSocketMessage(o);
      }
    )
  }

  fight() {
    this.started = true;
    this.ownPlayground = this.playgroundService.resetPlayground(true);
    this.enemyPlayground = this.playgroundService.resetPlayground(false);


    let initialRequest: InitialRequest = new class implements InitialRequest {
      firstList: Coordinates[] = [];
      zeroList: Coordinates[] = [];
    };

    this.ownPlayground.cells.map( v => {
      v.map( c => {
        if(c.value||0 > 0 ) {
          initialRequest.zeroList.push(new class implements Coordinates {
            x: number = c.x;
            y: number = c.y;
          })
        }
      })
    });

    this.enemyPlayground.cells.map( v => {
      v.map( c => {
        if(c.value||0 > 0 ) {
          initialRequest.firstList.push(new class implements Coordinates {
            x: number = c.x;
            y: number = c.y;
          })
        }
      })
    });

    this.ws.beginBattle(initialRequest).subscribe( r => {
      console.log("Let's battle begin!");
    });

    // this.socket.send(JSON.stringify(this.startMessage));
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


  onSocketMessage(event) {

    const message: WebSocketIncomingMessage = event;
    const plgrID = message.playgroundID ? message.playgroundID : 0;
    switch (message.type) {
      case 'started':
        // init both plgrs
        this.ownPlayground = this.playgroundService.createPlayground(true);
        this.enemyPlayground = this.playgroundService.createPlayground(false);
        break;
      case 'update_cell':
        const coords: Coordinates = {
          x: message.x ? message.x : 0,
          y: message.y ? message.y : 0
        };
        const value = message.value ? message.value : 0;
        if (plgrID === 0) {
          this.underAttack(true, coords)

          this.ownHadShoots++;
        } else {
          this.underAttack(false, coords)
          this.enemyHadShoots++;
        }
        break;
      case 'team_name':
        if (plgrID === 0) {
          this.nameOwn = message.name ? message.name : '';
          this.nameReady = true;
        } else {
          this.nameEnemy = message.name ? message.name : '';
          this.enemyReady = true;
        }
        break;
      case 'lose':
        if (plgrID === 0) {
          this.playgroundService.lose(this.ownPlayground);
        } else {
          this.playgroundService.lose(this.enemyPlayground);
        }
        this.started = false;
        break;
      case 'win':
        if (plgrID === 0) {
          this.playgroundService.win(this.ownPlayground);
        } else {
          this.playgroundService.win(this.enemyPlayground);
        }
        this.started = false;
        break;
    }
  }

  onSocketError(error) {
    console.log(`socket got error message ${error.message}`);
  }
}
