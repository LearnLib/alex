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
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../entities/project';
import { TestResource } from "../../../services/resources/test-resource.service";

export const testsImportModalComponent = {
  template: require('html-loader!./tests-import-modal.component.html'),
  bindings: {
    close: '&',
    dismiss: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class TestsImportModalComponent extends ModalComponent {

    /** The error message to display in case something fails. */
    public errorMessage: string = null;

    /** The tests to import. */
    public importData: any = null;

    /* @ngInject */
    constructor(private projectService: ProjectService,
                private testResource: TestResource) {
      super();
    }

    /**
     * Callback from the file drop zone.
     *
     * @param data The contents of the imported file.
     */
    fileLoaded(data: string): void {
      this.errorMessage = null;
      try {
        const importData = JSON.parse(data);
        if (importData.type !== 'tests' || importData.tests == null || importData.tests.length === 0) {
          throw 'The file does not seem to contain any tests';
        }
        this.importData = importData;
      } catch (exception) {
        this.errorMessage = '' + exception;
      }
    }

    /** Import all test cases. */
    importTests(): void {
      this.errorMessage = null;

      if (this.importData.tests.length) {
        const parentId = this.resolve.parent.id;

        const tests = this.importData.tests;
        tests.forEach(t => t.parent = parentId);

        this.testResource.import(this.project.id, tests)
          .then(tests => this.close({$value: tests}))
          .catch(err => this.errorMessage = err.data.message);
      } else {
        this.errorMessage = 'There aren\'t any tests to import';
      }
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
