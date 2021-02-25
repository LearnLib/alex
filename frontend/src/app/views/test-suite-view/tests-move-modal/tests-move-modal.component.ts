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

import { TestApiService } from '../../../services/api/test-api.service';
import { ToastService } from '../../../services/toast.service';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tests-move-modal',
  templateUrl: './tests-move-modal.component.html'
})
export class TestsMoveModalComponent implements OnInit {

  /** The tests to move. */
  @Input()
  tests: any[] = [];

  /** The root test suite. */
  root: any;

  /** The test suite to move the tests to. */
  selectedTestSuite: any;

  /** The error message to display. */
  errorMessage: string;

  constructor(private testApi: TestApiService,
              private toastService: ToastService,
              private appStore: AppStoreService,
              public modal: NgbActiveModal) {
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
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

    const testIds: number[] = this.tests.map(t => t.id);
    const targetId: number = this.selectedTestSuite.id;
    this.testApi.moveMany(this.project.id, testIds, targetId).subscribe(
      movedTests => {
        this.toastService.success('The tests have been moved.');
        this.modal.close(movedTests);
      },
      res => {
        this.errorMessage = `The tests could not be moved. ${res.error.message}`;
      }
    );
  }
}
