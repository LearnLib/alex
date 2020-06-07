import {Injectable, Predicate} from "@angular/core";
import { WebSocketAPIService } from "./api/websocket-api.service";
import { WebSocketMessage } from "../entities/websocket-message";
import {Subject} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Injectable()
export class WebSocketService {

  msgQueue: WebSocketMessage[] = [];

  connected: boolean;

  observerSubjects: Map<Predicate<WebSocketMessage>, Subject<WebSocketMessage>> = new Map();

  constructor(private websocketAPIService: WebSocketAPIService,
              private router: Router) {
    this.websocketAPIService.connectStatus$.subscribe(value => {
      this.connected = value == 2;
      if (this.connected) {
        while (this.msgQueue.length > 0) {
          this.websocketAPIService.send(this.msgQueue.shift());
        }
      }
    });

    this.websocketAPIService.messages$.subscribe(value => {
      this.processIncomingMessage(value);
    });

    this.websocketAPIService.errors$.subscribe(value => {
      this.processIncomingError(value);
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(r => this.routeChange(r));
  }

  private routeChange(r: any) {
    if (r.urlAfterRedirects.startsWith("/app")) {
      this.connect();
    }
  }

  connect() {
    this.websocketAPIService.connect()
  }

  disconnect() {
    this.websocketAPIService.disconnect()
  }
  
  send(message: WebSocketMessage) {
    if (this.connected) {
      this.websocketAPIService.send(message);
    } else {
      this.msgQueue.push(message);
    }
  }

  processIncomingMessage(message: WebSocketMessage) {
    this.observerSubjects.forEach((subject, predicate) => {
      if (predicate(message)) {
        subject.next(message);
      }
    })
  }

  processIncomingError(error: WebSocketMessage) {
    console.log(error.entity);
  }

  register(predicate: Predicate<WebSocketMessage>): Subject<WebSocketMessage> {
    const subject = new Subject<WebSocketMessage>();
    this.observerSubjects.set(predicate, subject);
    console.log(this.observerSubjects);
    return subject;
  }
}
