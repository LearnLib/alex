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
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { TestPresenceService } from "../services/test-presence.service";
import { Observable, of } from "rxjs";
import { ToastService } from "../services/toast.service";
import { AppStoreService } from "../services/app-store.service";

@Injectable({
  providedIn: 'root'
})

export class TestGuard implements CanActivate, CanActivateChild {
  constructor(private testPresenceService: TestPresenceService,
              private router: Router,
              private toastService: ToastService,
              private appStoreService: AppStoreService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const projectId = route.paramMap.get('projectId');
    const testId = route.paramMap.get('testId');
    const accessedTests = this.testPresenceService.accessedTestsValue;

    const testObject = accessedTests.get(Number(projectId))?.get(Number(testId));
    if (testObject && testObject.type == "case" && testObject.username !== this.appStoreService.user.username) {
      this.toastService.danger('Test is already in use by ' + testObject.username);
      return of(false);
    }

    return of(true);
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
