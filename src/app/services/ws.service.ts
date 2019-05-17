import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InitialRequest } from '../model';

const url = 'http://localhost:8081/';

@Injectable()
export class WsService {
  private stompClient;

  private subject: Subject<any>;

  constructor(private client: HttpClient) {
    this.subject = new Subject<any>();
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const ws = new SockJS(`${url}ws`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = null;
    const that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe('/events', message => {
        if (message.body) {
          that.handleMessage(message.body);
        }
      });
    });
  }

  public getObserver(): Observable<any> {
    return this.subject;
  }

  public handleMessage(message: any) {
    const o = JSON.parse(message);
    this.subject.next(o);
  }

  public beginBattle(initialRequest: InitialRequest): Observable<any> {
    return this.client.post(`${url}api/start`, initialRequest);
  }
}
