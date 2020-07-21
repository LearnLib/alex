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
    this.client = new StompJS.Client({
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.webSocketFactory = () => {
      return new SockJS(`${env.apiUrl}/ws/stomp`);
    };

    this.client.beforeConnect = () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt !== null) {
        this.connectStatus.next(1);
        this.client.connectHeaders = {
          Authorization: `Bearer ${jwt}`
        }
      } else {
        this.client.deactivate();
        this.connectStatus.next(0);
      }
    };

    this.client.onConnect = (frame) => {
      this.client.subscribe('/user/queue', (message) => this.messages.next(WebSocketMessage.fromJson(message.body)));
      this.client.subscribe('/user/queue/error', (error) => this.errors.next(WebSocketMessage.fromJson(error.body)));
      this.connectStatus.next(2);
    };

    this.client.onStompError = (error) => {
      console.log('Broker reported error: ' + error.headers['message']);
      console.log('Additional details: ' + error.body);
    };

    this.client.onWebSocketClose = () => {
      this.connectStatus.next(0);
    };
  }

  connect() {
    if (this.connectStatus.getValue() == 0) {
      this.client.activate();
    }
  };

  forceServerSideDisconnect(sessionId: string) {
    const jwt = localStorage.getItem('jwt');
    if (jwt != null && sessionId != null) {
      fetch(`${env.apiUrl}/ws/disconnect`, {
        method: 'POST',
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`
        },
        body: `{ "sessionId": "${sessionId}" }`
      })
    }
  }

  disconnect() {
    if (this.connectStatus.getValue() != 0) {
      this.client.deactivate();
      this.connectStatus.next(0);
    }
  }

  send(message: WebSocketMessage) {
    console.log(message);
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

