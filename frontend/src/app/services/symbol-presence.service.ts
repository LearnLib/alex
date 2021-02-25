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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketService } from './websocket.service';
import { NavigationEnd, Router } from '@angular/router';
import { ProjectApiService } from './api/project-api.service';
import { AppStoreService } from './app-store.service';
import { ToastService } from './toast.service';
import { WebSocketMessage } from '../entities/websocket-message';
import { filter } from 'rxjs/operators';

@Injectable()
export class SymbolPresenceService {

  private accessedSymbols = new BehaviorSubject(new Map());

  private accessedSymbolGroups = new BehaviorSubject(new Map());

  private oldRoute = '';

  private routeRegEx = /^\/app\/projects\/\d+\/symbols\/\d+/;

  constructor(private webSocketService: WebSocketService,
              private router: Router,
              private projectApiService: ProjectApiService,
              private appStoreService: AppStoreService,
              private toastService: ToastService) {
    this.webSocketService.register(msg => msg.entity === SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE
                                                 && msg.type === SymbolPresenceServiceEnum.STATUS)
      .subscribe(msg => this.processStatus(msg));

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(r => this.routeChange(r));

    this.projectApiService.getAll().subscribe(projects => {
      const projectIds = [];
      projects.forEach(project => {
        projectIds.push(project.id);
      });
      this.requestStatus(projectIds);
    });
  }

  private routeChange(r: any) {
    const newRoute = r.urlAfterRedirects;
    const oldProjectId = this.oldRoute.split('/')[3];
    const oldSymbolId = this.oldRoute.split('/')[5];
    const newProjectId = newRoute.split('/')[3];
    const newSymbolId = newRoute.split('/')[5];

    if (this.routeRegEx.test(newRoute)) {
      if(!this.routeRegEx.test(this.oldRoute) || oldProjectId !== newProjectId || oldSymbolId !== newSymbolId) {
        this.userEnteredSymbol(Number(newProjectId), Number(newSymbolId));
      }
    } else {
      if (this.routeRegEx.test(this.oldRoute)) {
        this.userLeftSymbol(Number(oldProjectId), Number(oldSymbolId));
      }
    }

    this.oldRoute = newRoute;
  }

  private processStatus(msg: WebSocketMessage) {
    const projects = msg.content;

    const symbolsUpdate = this.accessedSymbols.getValue();
    const groupsUpdate = this.accessedSymbolGroups.getValue();

    for (const projectId in projects) {
      const symbols = projects[projectId].symbols;

      if (!Object.keys(symbols).length) {
        symbolsUpdate.delete(Number(projectId));
      } else {
        let symbolsObject = symbolsUpdate.get(Number(projectId));
        if (!symbolsObject) {
          symbolsObject = new Map();
        } else {
          symbolsObject.clear();
        }

        for (const symbolId in symbols) {
          const symbol = symbols[symbolId];
          const symbolObject= {} as SymbolLockInfo;
          symbolObject.type = symbol.type;
          symbolObject.username = symbol.username;
          symbolObject.date = new Date(symbol.timestamp);

          symbolsObject.set(Number(symbolId), symbolObject);
        }

        symbolsUpdate.set(Number(projectId), symbolsObject);
      }

      const groups = projects[projectId].groups;

      if (!Object.keys(groups).length) {
        groupsUpdate.delete(Number(projectId));
      } else {
        let groupsObject = groupsUpdate.get(Number(projectId));
        if (!groupsObject) {
          groupsObject = new Map();
        } else {
          groupsObject.clear();
        }

        for (const groupId in groups) {
          const group = groups[groupId];
          const groupObject = {} as SymbolGroupLockInfo;
          groupObject.type = group.type;
          groupObject.locks = group.locks;

          groupsObject.set(Number(groupId), groupObject);
        }

        groupsUpdate.set(Number(projectId), groupsObject);
      }
    }

    this.accessedSymbols.next(symbolsUpdate);
    this.accessedSymbolGroups.next(groupsUpdate);

    const routeSegments = this.router.url.split('/');
    const projectId = Number(routeSegments[3]);
    const symbolId = Number(routeSegments[5]);

    if (!isNaN(projectId) && !isNaN(symbolId)) {
      const symbolLock = this.accessedSymbols.getValue().get(projectId)?.get(symbolId);
      if (symbolLock && symbolLock.username !== this.appStoreService.user.username) {
        this.router.navigate(['/app', 'projects', this.appStoreService.project.id, 'symbols']);
        this.toastService.danger('Symbol is already locked by ' + symbolLock.username);
      }
    }
  }

  private requestStatus(projectIds: number[]) {
    const msg = new WebSocketMessage();
    msg.entity = SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE;
    msg.type = SymbolPresenceServiceEnum.STATUS_REQUEST;
    msg.content = '{"projectIds":[' + projectIds.toString() + ']}';
    this.webSocketService.send(msg);
  }

  private userEnteredSymbol(projectId: number, symbolId: number) {
    const msg = new WebSocketMessage();
    msg.entity = SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE;
    msg.type = SymbolPresenceServiceEnum.USER_ENTERED;
    msg.content = '{"projectId":"' + projectId + '",' +
      '"symbolId":"' + symbolId + '"}';
    this.webSocketService.send(msg);
  }

  private userLeftSymbol(projectId: number, symbolId: number) {
    const msg = new WebSocketMessage();
    msg.entity = SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE;
    msg.type = SymbolPresenceServiceEnum.USER_LEFT;
    msg.content = '{"projectId":"' + projectId + '",' +
      '"symbolId":"' + symbolId + '"}';
    this.webSocketService.send(msg);
  }

  get accessedSymbols$() {
    return this.accessedSymbols.asObservable();
  }

  get accessedSymbolsValue() {
    return this.accessedSymbols.getValue();
  }

  get accessedSymbolGroups$() {
    return this.accessedSymbolGroups.asObservable();
  }

  get accessedSymbolGroupsValue() {
    return this.accessedSymbolGroups.getValue();
  }
}

export enum SymbolPresenceServiceEnum {
  SYMBOL_PRESENCE_SERVICE = 'SYMBOL_PRESENCE_SERVICE',
  USER_LEFT = 'USER_LEFT',
  USER_ENTERED = 'USER_ENTERED',
  STATUS_REQUEST = 'STATUS_REQUEST',
  STATUS = 'STATUS'
}

interface AbstractSymbolLockInfo {
  type: string;
}

export interface SymbolLockInfo extends AbstractSymbolLockInfo {
  username: string;
  date: Date;
}

export interface SymbolGroupLockInfo extends AbstractSymbolLockInfo {
  locks: string[];
}
