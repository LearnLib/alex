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
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AppStoreService } from '../services/app-store.service';
import { SymbolPresenceService } from '../services/symbol-presence.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SymbolGuard implements CanActivate {
  constructor(private symbolPresenceService: SymbolPresenceService,
              private router: Router,
              private toastService: ToastService,
              private appStoreService: AppStoreService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const projectId = route.paramMap.get('projectId');
    const symbolId = route.paramMap.get('symbolId');
    const accessedSymbols = this.symbolPresenceService.accessedSymbolsValue;

    const symbolObject = accessedSymbols.get(Number(projectId))?.get(Number(symbolId));
    if (symbolObject && symbolObject.username !== this.appStoreService.user.username) {
      this.toastService.danger('Symbol is already in use by ' +  symbolObject.username);
      return of(false);
    }

    return of(true);
  }
}
