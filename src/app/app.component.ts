import { Component, OnInit } from '@angular/core';
import { PlaygroundService } from './services/playground.service';
import {
  Playground,
  Coordinates,
  ATTACK_STATUS,
  WebSocketIncomingMessage,
  WebSocketOutgoingMessage
} from './model';

const N = 10;

const url = 'ws://localhost/ws';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private started = false;
  private ownPlayground: Playground;
  private enemyPlayground: Playground;
  private fog: number[][];
  private emptyFog: number[][];
  private ownHadShoots = 0;
  private enemyHadShoots = 0;
  private nameOwn = 'Команда А';
  private nameEnemy = 'Команда Б';

  private socket: WebSocket;
  private startMessage: WebSocketOutgoingMessage = { started: true };

  constructor(private playgroundService: PlaygroundService) {}

  ngOnInit() {
    this.socket = new WebSocket(url);
    this.socket.onopen = this.onSocketOpen;
    this.socket.onclose = this.onSocketClose;
    this.socket.onmessage = this.onSocketMessage;
    this.socket.onerror = this.onSocketError;

    this.fog = this.playgroundService.getFog();
    this.emptyFog = this.playgroundService.getEmptyFog();
    this.ownPlayground = this.playgroundService.createPlayground(true);
    this.enemyPlayground = this.playgroundService.createPlayground(false);
  }

  fight() {
    this.started = true;
    this.ownPlayground = this.playgroundService.resetPlayground(true);
    this.enemyPlayground = this.playgroundService.resetPlayground(false);
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

  onSocketOpen() {
    console.log('WS connection established');
  }

  onSocketClose(event) {
    if (event.wasClean) {
      console.log('Connection closed successfully');
    } else {
      console.log('Connection lost');
    }
    console.log('Code: ' + event.code + ' reason: ' + event.reason);
  }

  onSocketMessage(event) {
    console.log(`got message ${event}`);
    const message: WebSocketIncomingMessage = JSON.parse(event);
    const plgrID = message.playgroundID ? message.playgroundID : 0;
    switch (message.type) {
      case 'started':
        // init both plgrs
        this.ownPlayground = this.playgroundService.createPlayground(true);
        this.enemyPlayground = this.playgroundService.createPlayground(false);
        break;
      case 'set_cells':
        const cells = message.cells ? message.cells : [];
        if (plgrID === 0) {
          this.ownPlayground = this.playgroundService.setCells(
            this.ownPlayground,
            cells
          );
        } else {
          this.enemyPlayground = this.playgroundService.setCells(
            this.enemyPlayground,
            cells
          );
        }
        break;
      case 'update_cell':
        const coords: Coordinates = {
          x: message.x ? message.x : 0,
          y: message.y ? message.y : 0
        };
        const value = message.value ? message.value : 0;
        if (plgrID === 0) {
          this.playgroundService.updateCell(this.ownPlayground, coords, value);
          this.ownHadShoots++;
        } else {
          this.playgroundService.updateCell(
            this.enemyPlayground,
            coords,
            value
          );
          this.enemyHadShoots++;
        }
        break;
      case 'team_name':
        if (plgrID === 0) {
          this.nameOwn = message.name ? message.name : '';
        } else {
          this.nameEnemy = message.name ? message.name : '';
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
