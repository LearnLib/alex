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

import { ModalComponent } from '../modal.component';
import { TestApiService } from '../../../services/resources/test-resource.service';
import { ToastService } from '../../../services/toast.service';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

export const testsMoveModalComponent = {
  template: require('html-loader!./tests-move-modal.component.html'),
  bindings: {
    resolve: '=',
    close: '&',
    dismiss: '&'
  },
  controllerAs: 'vm',
  controller: class TestsMoveModalComponent extends ModalComponent {

    /** The root test suite. */
    public root: any = null;

    /** The tests to move. */
    public tests: any[] = [];

    /** The test suite to move the tests to. */
    public selectedTestSuite: any = null;

    /** The error message to display. */
    public errorMessage: string = null;

    /* @ngInject */
    constructor(private testApi: TestApiService,
                private toastService: ToastService,
                private appStore: AppStoreService) {
      super();
    }

    $onInit(): void {
      this.tests = this.resolve.tests;

      this.testApi.getRoot(this.project.id).subscribe(
        root => this.root = root
      );
    }

    /**
     * Select a target test suite.
     *
     * @param testSuite The target test suite.
     */
    selectTestSuite(testSuite: any): void {
      if (this.selectedTestSuite == null) {
        this.selectedTestSuite = testSuite;
      } else if (this.selectedTestSuite.id === testSuite.id) {
        this.selectedTestSuite = this.root;
      } else {
        this.selectedTestSuite = testSuite;
      }
    }

    /**
     * Move the tests to the new test suite.
     */
    moveTests(): void {
      this.errorMessage = null;

      if (this.selectedTestSuite == null) {
        this.errorMessage = 'You have to select a test suite.';
        return;
      }

      const testIds: number[] = this.tests.map(t => t.id);
      const targetId: number = this.selectedTestSuite.id;
      this.testApi.moveMany(this.project.id, testIds, targetId).subscribe(
        movedTests => {
          this.toastService.success('The tests have been moved.');
          this.close({$value: movedTests});
        },
        err => {
          this.errorMessage = `The tests could not be moved. ${err.data.message}`;
        }
      );
    }

    get project(): Project {
      return this.appStore.project;
    }
  }
};
