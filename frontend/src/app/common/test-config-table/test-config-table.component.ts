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

import { Component, Input, OnInit } from '@angular/core';
import { AppStoreService } from '../../services/app-store.service';
import { TestApiService } from '../../services/api/test-api.service';

@Component({
  selector: 'test-config-table',
  templateUrl: './test-config-table.component.html',
  styleUrls: ['./test-config-table.component.scss']
})
export class TestConfigTableComponent implements OnInit {

  @Input()
  config: any;

  tests: any[] = [];

  constructor(private appStore: AppStoreService,
              private testApi: TestApiService) {
  }

  ngOnInit() {
    if (this.config.tests.length > 0) {
      this.testApi.getMany(this.appStore.project.id, this.config.tests).subscribe(tests => {
        this.tests = tests;
      });
    }
  }
}
