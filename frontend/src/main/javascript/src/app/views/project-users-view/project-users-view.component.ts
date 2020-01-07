/*
 * Copyright 2015 - 2019 TU Dortmund
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

import { Component, OnInit } from '@angular/core';
//import { AdminUsersViewStoreService } from './admin-users-view-store.service';
import { AppStoreService } from '../../services/app-store.service';
import { User } from '../../entities/user';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash';
import {ProjectUsersViewStoreService} from "./project-users-view-store.service";

@Component({
  selector: 'project-users-view',
  templateUrl: './project-users-view.component.html',
  providers: [ProjectUsersViewStoreService]
})
export class ProjectUsersViewComponent implements OnInit {


  constructor(public store: ProjectUsersViewStoreService,
              public appStore: AppStoreService) {
  }

  ngOnInit() {
    this.store.load();
  }



}
