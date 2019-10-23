import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { AppStoreService } from '../services/app-store.service';
import { Observable, of } from 'rxjs';
import { ProjectApiService } from '../services/resources/project-api.service';
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
        projectId = parseInt(curr.paramMap.get('projectId'));
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
