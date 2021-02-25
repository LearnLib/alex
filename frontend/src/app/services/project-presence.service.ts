/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { WebSocketService } from './websocket.service';
import { BehaviorSubject } from 'rxjs';
import { WebSocketMessage } from '../entities/websocket-message';
import { ProjectApiService } from './api/project-api.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export enum ProjectPresenceServiceEnum {
  PROJECT_PRESENCE_SERVICE = 'PROJECT_PRESENCE_SERVICE',
  USER_LEFT = 'USER_LEFT',
  USER_ENTERED = 'USER_ENTERED',
  STATUS_REQUEST = 'STATUS_REQUEST',
  STATUS = 'STATUS'
}

@Injectable()
export class ProjectPresenceService {

  private activeUsers = new BehaviorSubject(new Map());

  private oldRoute = '';

  constructor(private webSocketService: WebSocketService,
              private router: Router,
              private projectApiService: ProjectApiService) {
    this.webSocketService.register(msg => msg.entity === ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE
                                                 && msg.type === ProjectPresenceServiceEnum.STATUS)
      .subscribe(msg => this.processStatus(msg));

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(r => this.routeChange(r));
  }

  public requestStatus(projectIds: number[]) {
    const msg = new WebSocketMessage();
    msg.entity = ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE;
    msg.type = ProjectPresenceServiceEnum.STATUS_REQUEST;
    msg.content = '{"projectIds":[' + projectIds.toString() + ']}';
    this.webSocketService.send(msg);
  }

  public userEnteredProject(projectId: number) {
    const msg = new WebSocketMessage();
    msg.entity = ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE;
    msg.type = ProjectPresenceServiceEnum.USER_ENTERED;
    msg.content = '{"projectId":"' + projectId + '"}';
    this.webSocketService.send(msg);
  }

  public userLeftProject(projectId: number) {
    const msg = new WebSocketMessage();
    msg.entity = ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE;
    msg.type = ProjectPresenceServiceEnum.USER_LEFT;
    msg.content = '{"projectId":"' + projectId + '"}';
    this.webSocketService.send(msg);
  }

  private routeChange(r: any) {
    const newRoute = r.urlAfterRedirects;
    const oldProjectId = this.oldRoute.split('/')[3];
    const newProjectId = newRoute.split('/')[3];

    if (newRoute.startsWith('/app') && !this.oldRoute.startsWith('/app')) {
      this.projectApiService.getAll().subscribe(projects => {
        const projectIds = [];
        projects.forEach(project => {
          projectIds.push(project.id);
        });
        this.requestStatus(projectIds);
      });
    }

    if (/^\/app\/projects\/\d+/.test(newRoute)) {
      if (!/^\/app\/projects\/\d+/.test(this.oldRoute) || oldProjectId !== newProjectId) {
        this.userEnteredProject(Number(newProjectId));
      }
    } else {
      if (/^\/app\/projects\/\d+/.test(this.oldRoute)) {
        this.userLeftProject(Number(oldProjectId));
      }
    }

    this.oldRoute = newRoute;
  }

  private processStatus(msg: WebSocketMessage) {
    const projects = msg.content;

    const update = this.activeUsers.getValue();
    for (const projectKey in projects) {
      if (projects.hasOwnProperty(projectKey)) {
        const project = projects[projectKey];

        if (!Object.keys(project).length) {
          update.delete(Number(projectKey));
        } else {
          let projectUser = update.get(Number(project.projectId));
          if (!projectUser) {
            projectUser = new Map();
          } else {
            projectUser.clear();
          }

          for (const userName in project.userColors) {
            if (project.userColors.hasOwnProperty(userName)) {
              projectUser.set(userName, project.userColors[userName]);
            }
          }

          update.set(Number(project.projectId), projectUser);
        }
      }
    }
    this.activeUsers.next(update);
  }

  get activeUsers$() {
    return this.activeUsers.asObservable();
  }
}
