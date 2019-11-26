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

import { TestApiService } from '../../services/api/test-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { ErrorViewStoreService } from '../error-view/error-view-store.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * The view for the tests.
 */
@Component({
  selector: 'tests-view',
  templateUrl: './tests-view.component.html'
})
export class TestsViewComponent implements OnInit {

  /** The test case or test suite. */
  test: any;

  constructor(private route: ActivatedRoute,
              private appStore: AppStoreService,
              private errorViewStore: ErrorViewStoreService,
              private testApi: TestApiService) {
  }

  ngOnInit(): void {
    const project = this.appStore.project;

    this.route.paramMap.subscribe(
      map => {
        this.test = null;
        if (map.has('testId')) {
          const testId: number = parseInt(map.get('testId'));
          this.testApi.get(project.id, testId).subscribe(
            data => this.test = data,
            res => this.errorViewStore.navigateToErrorPage(res.error.message)
          );
        }  else {
          this.testApi.getRoot(project.id).subscribe(
            data => this.test = data,
            res => this.errorViewStore.navigateToErrorPage(res.error.message)
          );
        }
      }
    );
  }
}
