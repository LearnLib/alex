/*
 * Copyright 2015 - 2020 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable, Predicate } from "@angular/core";
import { WebSocketAPIService } from "./api/websocket-api.service";
import { WebSocketMessage } from "../entities/websocket-message";
import { Subject } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable()
export class WebSocketService {

  msgQueue: WebSocketMessage[] = [];

  connected: boolean;

  observerSubjects: Map<Predicate<WebSocketMessage>, Subject<WebSocketMessage>> = new Map();

  sessionId: null;

  constructor(private websocketAPIService: WebSocketAPIService,
              private router: Router) {
    this.websocketAPIService.connectStatus$.subscribe(value => {
      this.connected = value == 2;
      if (this.connected) {
        if (this.sessionId == null) {
          this.requestSessionId();
        }
        while (this.msgQueue.length > 0) {
          this.websocketAPIService.send(this.msgQueue.shift());
        }
      } else {
        this.sessionId = null;
      }
    });

    this.websocketAPIService.messages$.subscribe(value => {
      this.processIncomingMessage(value);
    });

    this.websocketAPIService.errors$.subscribe(value => {
      this.processIncomingError(value);
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(r => this.routeChange(r));

    window.onbeforeunload = (e) => {
      this.websocketAPIService.forceServerSideDisconnect(this.sessionId);
      return undefined;
    };
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
    this.websocketAPIService.disconnect();
  }
  
  send(message: WebSocketMessage) {
    if (this.connected) {
      this.websocketAPIService.send(message);
    } else {
      this.msgQueue.push(message);
    }
  }

  processIncomingMessage(message: WebSocketMessage) {

    if (message.entity == WebSocketServiceEnum.WEBSOCKET_SERVICE && message.type == WebSocketServiceEnum.SESSION_ID) {
      this.sessionId = message.content.sessionId;
    }

    this.observerSubjects.forEach((subject, predicate) => {
      if (predicate(message)) {
        subject.next(message);
      }
    })
  }

  processIncomingError(error: WebSocketMessage) {
    console.log(error);
  }

  register(predicate: Predicate<WebSocketMessage>): Subject<WebSocketMessage> {
    const subject = new Subject<WebSocketMessage>();
    this.observerSubjects.set(predicate, subject);
    return subject;
  }

  private requestSessionId() {
    const msg = new WebSocketMessage();
    msg.entity = WebSocketServiceEnum.WEBSOCKET_SERVICE;
    msg.type = WebSocketServiceEnum.REQUEST_SESSION_ID;
    this.send(msg);
  }
}

export enum WebSocketServiceEnum {
  WEBSOCKET_SERVICE = "WEBSOCKET_SERVICE",
  LOGOUT_CHECK = "LOGOUT_CHECK",
  LOGOUT = "LOGOUT",
  REQUEST_SESSION_ID = "REQUEST_SESSION_ID",
  SESSION_ID = "SESSION_ID"
}
