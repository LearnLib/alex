import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {TestPresenceService} from "../services/test-presence.service";
import {Observable, of} from "rxjs";
import {ToastService} from "../services/toast.service";
import {AppStoreService} from "../services/app-store.service";

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

    const testObject = accessedTests.get(projectId)?.get(testId);
    if (testObject && testObject.type == "case" && testObject.username != this.appStoreService.user.username) {
      return of(false);
    }

    return of(true);
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
