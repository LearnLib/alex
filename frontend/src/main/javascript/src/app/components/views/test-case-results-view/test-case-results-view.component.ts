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

import { TestApiService } from '../../../services/resources/test-resource.service';
import { IPromise } from 'angular';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';
import { Observable } from 'rxjs';

export const testCaseResultsViewComponent = {
  template: require('html-loader!./test-case-results-view.component.html'),
  controllerAs: 'vm',
  controller: class TestCaseResultsViewComponent {

    /** The test. */
    public test: any;

    /** The results of the test. */
    public results: any[];

    /** The current page object. */
    public page: any;

    /* @ngInject */
    constructor(private appStore: AppStoreService,
                private testApi: TestApiService,
                private $stateParams: any) {
      this.test = null;
      this.results = [];
      this.page = {};

      this.testApi.get(this.project.id, this.$stateParams.testId).subscribe(
        test => {
          this.test = test;
          this.loadTestResults();
        },
        console.error
      );
    }

    loadTestResults(page: number = 0): void {
      this.testApi.getResults(this.project.id, this.test.id, page).subscribe(page => {
        this.page = page;
        this.results = page.content;
      });
    }

    nextPage(): void {
      this.loadTestResults(Math.min(this.page.totalPages, this.page.number + 1));
    }

    previousPage(): void {
      this.loadTestResults(Math.max(0, this.page.number - 1));
    }

    get project(): Project {
      return this.appStore.project;
    }
  }
};
