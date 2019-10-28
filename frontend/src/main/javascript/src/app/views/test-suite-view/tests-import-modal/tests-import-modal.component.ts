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

import { Project } from '../../../entities/project';
import { TestApiService } from '../../../services/api/test-api.service';
import { AppStoreService } from '../../../services/app-store.service';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tests-import-modal',
  templateUrl: './tests-import-modal.component.html'
})
export class TestsImportModalComponent {

  @Input()
  parent: any;

  /** The error message to display in case something fails. */
  errorMessage: string;

  /** The tests to import. */
  importData: any;

  constructor(private appStore: AppStoreService,
              private testApi: TestApiService,
              public modal: NgbActiveModal) {
  }

  get project(): Project {
    return this.appStore.project;
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
      const tests = this.importData.tests;
      tests.forEach(t => t.parent = this.parent.id);

      this.testApi.import(this.project.id, tests).subscribe(
        tests => this.modal.close(tests),
        err => this.errorMessage = err.data.message
      );
    } else {
      this.errorMessage = 'There aren\'t any tests to import';
    }
  }
}
