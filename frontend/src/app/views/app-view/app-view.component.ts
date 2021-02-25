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

import { Component } from '@angular/core';
import { AppStoreService } from '../../services/app-store.service';
import { ProjectPresenceService } from '../../services/project-presence.service';
import { TestPresenceService } from '../../services/test-presence.service';
import { SymbolPresenceService } from '../../services/symbol-presence.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.scss']
})
export class AppViewComponent {

  activeUsers$: Observable<Map<string, string>>;

  // The presence services getting injected to force their creation at exactly this point.
  constructor(public appStore: AppStoreService,
              public projectPresenceService: ProjectPresenceService,
              private testPresenceService: TestPresenceService,
              private symbolPresenceService: SymbolPresenceService) {

    this.activeUsers$ = this.projectPresenceService.activeUsers$.pipe(
      filter(m => this.appStore.project != null
          && m.get(this.appStore.project.id) != null),
      map(m => m.get(this.appStore.project.id))
    );
  }

  get username(): string {
    return this.appStore.user.username;
  }
}
