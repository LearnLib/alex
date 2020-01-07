import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AppStoreService } from '../services/app-store.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectOwnerGuard implements CanActivate {

  constructor(private appStore: AppStoreService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const project = this.appStore.project;
    const user = this.appStore.user;

    if (project.owners.includes(user.id)) {
      return of(true);
    }

  }
}
