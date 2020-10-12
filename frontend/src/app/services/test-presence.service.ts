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

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WebSocketService } from "./websocket.service";
import { WebSocketMessage } from "../entities/websocket-message";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { ProjectApiService } from "./api/project-api.service";
import { AppStoreService } from "./app-store.service";
import { ToastService } from "./toast.service";

@Injectable()
export class TestPresenceService {

  private accessedTests = new BehaviorSubject(new Map());

  private oldRoute = '';

  private routeRegEx = /^\/app\/projects\/\d+\/tests\/\d+/;

  constructor(private webSocketService: WebSocketService,
              private router: Router,
              private projectApiService: ProjectApiService,
              private appStoreService: AppStoreService,
              private toastService: ToastService) {
    this.webSocketService.register(msg => msg.entity === TestPresenceServiceEnum.TEST_PRESENCE_SERVICE
                                                 && msg.type === TestPresenceServiceEnum.STATUS)
      .subscribe(msg => this.processStatus(msg));

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(r => this.routeChange(r));

    this.projectApiService.getAll().subscribe(projects => {
      const projectIds = [];
      projects.forEach(project => {
        projectIds.push(project.id);
      });
      this.requestStatus(projectIds);
    })
  }

  private routeChange(r: any) {
    const newRoute = r.urlAfterRedirects;
    const oldProjectId = this.oldRoute.split('/')[3];
    const oldTestId = this.oldRoute.split('/')[5];
    const newProjectId = newRoute.split('/')[3];
    const newTestId = newRoute.split('/')[5];

    if (this.routeRegEx.test(newRoute)) {
      if(!this.routeRegEx.test(this.oldRoute) || oldProjectId !== newProjectId || oldTestId != newTestId) {
        this.userEnteredTest(Number(newProjectId), Number(newTestId));
      }
    } else {
      if (this.routeRegEx.test(this.oldRoute)) {
        this.userLeftTest(Number(oldProjectId), Number(oldTestId));
      }
    }

    this.oldRoute = newRoute;
  }

  private processStatus(msg: WebSocketMessage) {
    const projects = msg.content;

    const update = this.accessedTests.getValue();
    for (let projectId in projects) {
      const tests = projects[projectId];

      if (!Object.keys(tests).length) {
        update.delete(Number(projectId));
      } else {
        let testsObject = update.get(Number(projectId));
        if (!testsObject) {
          testsObject = new Map();
        } else {
          testsObject.clear();
        }

        for (let testId in tests) {
          const test = tests[testId];

          let testObject;
          if (test.type === 'case') {
            testObject = {} as TestCaseLockInfo;
            testObject.username = test.username;
            testObject.date = new Date(test.timestamp);
          } else {
            testObject = {} as TestSuiteLockInfo;
            testObject.locks = test.locks;
          }
          testObject.type = test.type;

          testsObject.set(Number(testId), testObject)
        }

        update.set(Number(projectId), testsObject);
      }
    }

    this.accessedTests.next(update);

    const routeSegments = this.router.url.split("/");
    const projectId = Number(routeSegments[3]);
    const testId = Number(routeSegments[5]);

    if (!isNaN(projectId) && !isNaN(testId)) {
      const testLock = this.accessedTests.getValue().get(projectId)?.get(testId);
      if (testLock && testLock.type === "case"  && testLock.username !== this.appStoreService.user.username) {
        this.router.navigate(['/app', 'projects', this.appStoreService.project.id, 'tests']);
        this.toastService.danger('Test is already locked by ' + testLock.username);
      }
    }
  }

  private userEnteredTest(projectId: number, testId: number) {
    const msg = new WebSocketMessage();
    msg.entity = TestPresenceServiceEnum.TEST_PRESENCE_SERVICE;
    msg.type = TestPresenceServiceEnum.USER_ENTERED;
    msg.content = '{"projectId":"' + projectId + '",' +
                  '"testId":"' + testId + '"}';
    this.webSocketService.send(msg);
  }

  private userLeftTest(projectId: number, testId: number) {
    const msg = new WebSocketMessage();
    msg.entity = TestPresenceServiceEnum.TEST_PRESENCE_SERVICE;
    msg.type = TestPresenceServiceEnum.USER_LEFT;
    msg.content = '{"projectId":"' + projectId + '",' +
      '"testId":"' + testId + '"}';
    this.webSocketService.send(msg);
  }

  public requestStatus(projectIds: number[]) {
    const msg = new WebSocketMessage();
    msg.entity = TestPresenceServiceEnum.TEST_PRESENCE_SERVICE;
    msg.type = TestPresenceServiceEnum.STATUS_REQUEST;
    msg.content = '{"projectIds":[' + projectIds.toString() + ']}';
    this.webSocketService.send(msg);
  }

  get accessedTests$() {
    return this.accessedTests.asObservable();
  }

  get accessedTestsValue() {
    return this.accessedTests.getValue();
  }
}

export enum TestPresenceServiceEnum {
  TEST_PRESENCE_SERVICE = 'TEST_PRESENCE_SERVICE',
  USER_LEFT = 'USER_LEFT',
  USER_ENTERED = 'USER_ENTERED',
  STATUS_REQUEST = 'STATUS_REQUEST',
  STATUS = 'STATUS'
}

export interface TestLockInfo {
  type: string;
}

export interface TestCaseLockInfo extends TestLockInfo {
  username: string;
  date: Date;
}

export interface TestSuiteLockInfo extends TestLockInfo {
  locks: string[];
}
