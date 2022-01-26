/*
 * Copyright 2015 - 2022 TU Dortmund
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
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { AppStoreService } from '../services/app-store.service';
import { Observable, of } from 'rxjs';
import { ProjectApiService } from '../services/api/project-api.service';
import { Project } from '../entities/project';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectGuard implements CanActivate, CanActivateChild {

  constructor(private appStore: AppStoreService,
              private projectApi: ProjectApiService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let projectId;
    let curr = route;
    while (curr != null) {
      if (curr.paramMap.has('projectId')) {
        projectId = Number(curr.paramMap.get('projectId'));
        break;
      }
      curr = curr.parent;
    }

    const project = this.appStore.project;
    if (project == null || projectId !== project.id) {
      return this.projectApi.get(projectId).pipe(
        tap((p: any) => this.appStore.openProject(p as Project)),
        map(() => true)
      );
    } else {
      return of(true);
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
