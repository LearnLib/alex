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

import { TestApiService } from '../../../services/resources/test-api.service';
import { AppStoreService } from '../../../services/app-store.service';
import { ErrorViewStoreService } from '../../../views/error-view/error-view-store.service';

/**
 * The view for the tests.
 */
export const testsViewComponent = {
  template: require('html-loader!./tests-view.component.html'),
  controllerAs: 'vm',
  controller: class TestsViewComponent {

    /** The test case or test suite. */
    public test: any;

    /* @ngInject */
    constructor(private $state: any,
                private appStore: AppStoreService,
                private errorViewStore: ErrorViewStoreService,
                private testApi: TestApiService) {

      this.test = null;

      const project = this.appStore.project;
      const testId: number = $state.params.testId;
      if (testId === 0) {
        testApi.getRoot(project.id).subscribe(
          data => this.test = data,
          res => errorViewStore.navigateToErrorPage(res.error.message)
        );
      } else {
        testApi.get(project.id, testId).subscribe(
          data => this.test = data,
          res => errorViewStore.navigateToErrorPage(res.error.message)
        );
      }
    }
  }
};
