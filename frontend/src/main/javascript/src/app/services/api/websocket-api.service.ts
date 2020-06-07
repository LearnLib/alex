import * as StompJS from "@stomp/stompjs";
import * as SockJS from 'sockjs-client';
import { Injectable } from "@angular/core";
import { environment as env } from '../../../environments/environment';
import { BehaviorSubject, Subject } from "rxjs";
import { WebSocketMessage } from "../../entities/websocket-message";
import { Client } from "@stomp/stompjs";

@Injectable()
export class WebSocketAPIService {

  private client: Client;

  private connectStatus = new BehaviorSubject<number>(0);

  private messages = new Subject<WebSocketMessage>();

  private errors = new Subject<WebSocketMessage>();

  constructor() {

    const _this = this;

    this.client = new StompJS.Client({
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.webSocketFactory = () => {
      return new SockJS(`${env.apiUrl}/ws`);
    };

    this.client.beforeConnect = () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt !== null) {
        _this.connectStatus.next(1);
        _this.client.connectHeaders = {
          Authorization: `Bearer ${jwt}`
        }
      } else {
        _this.client.deactivate();
        _this.connectStatus.next(0);
      }
    };

    this.client.onConnect = () => {
      _this.connectStatus.next(2);
      _this.client.subscribe('/user/queue', (message) => _this.messages.next(WebSocketMessage.fromJson(message.body)));
      _this.client.subscribe('/user/queue/error', (error) => _this.errors.next(WebSocketMessage.fromJson(error.body)));
    };

    this.client.onStompError = (error) => {
      console.log('Broker reported error: ' + error.headers['message']);
      console.log('Additional details: ' + error.body);
    };

    this.client.onWebSocketClose = () => {
      _this.connectStatus.next(0);
      console.log("CLOSED !!!!!!!");
    };

    window.addEventListener('beforeunload', evt => {
      _this.client.deactivate();
      _this.connectStatus.next(0);
      console.log("fired")
    })
  }

  connect() {
    if (this.connectStatus.getValue() == 0) {
      this.client.activate();
    }
  };

  disconnect() {
    if (this.connectStatus.getValue() != 0) {
      this.client.deactivate();
      this.connectStatus.next(0);
    }
  }

  send(message: WebSocketMessage) {
    this.client.publish({destination: '/app/send/event', body: JSON.stringify(message)});
  }

  get connectStatus$() {
    return this.connectStatus.asObservable();
  }

  get messages$() {
    return this.messages.asObservable();
  }

  get errors$() {
    return this.errors.asObservable();
  }
}
