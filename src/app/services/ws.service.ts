import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {InitialRequest} from '../model';


@Injectable()
export class WsService {
  private stompClient;


  private subject: Subject<any>;

  constructor(private client: HttpClient) {
    this.subject = new Subject<any>();
    this.initializeWebSocketConnection();

  }


  initializeWebSocketConnection() {
    let ws = new SockJS('http://localhost:8081/ws');
    this.stompClient = Stomp.over(ws);
   // this.stompClient.debug = null;
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/events', (message) => {
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
    let o = JSON.parse(message);
    this.subject.next(o);
  }


  public beginBattle(initialRequest: InitialRequest): Observable<any> {

    return this.client.post("http://localhost:8081/api/start", initialRequest);

  }

}
