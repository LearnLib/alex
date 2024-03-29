/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { orderBy, remove } from 'lodash';
import { Selectable } from '../../utils/selectable';
import { SymbolGroupApiService } from '../../services/api/symbol-group-api.service';
import { ToastService } from '../../services/toast.service';
import { TestApiService } from '../../services/api/test-api.service';
import { PromptService } from '../../services/prompt.service';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { DownloadService } from '../../services/download.service';
import { ClipboardService } from '../../services/clipboard.service';
import { NotificationService } from '../../services/notification.service';
import { TestConfigApiService } from '../../services/api/test-config-api.service';
import { TestReportApiService } from '../../services/api/test-report-api.service';
import { Project } from '../../entities/project';
import { TestCase } from '../../entities/test-case';
import { AppStoreService } from '../../services/app-store.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestConfigModalComponent } from '../tests-view/test-config-modal/test-config-modal.component';
import { TestsMoveModalComponent } from './tests-move-modal/tests-move-modal.component';
import { TestReportStatus, TestStatus } from '../../entities/test-status';
import { TestLockInfo, TestPresenceService } from '../../services/test-presence.service';
import { TestExecutionConfig } from '../../entities/test-execution-config';
import { TestSuite } from '../../entities/test-suite';

@Component({
  selector: 'test-suite-view',
  templateUrl: './test-suite-view.component.html'
})
export class TestSuiteViewComponent implements OnInit, OnDestroy {

  /** The test suite. */
  @Input()
  testSuite: any;

  /** The test report. */
  report: any;

  /** The driver configuration. */
  testConfig: any;

  root: TestSuite;

  testConfigs: any[];

  selectedTests: Selectable<any, any>;

  testStatus: TestStatus;

  lockInfo: Map<number, Map<number, TestLockInfo>>;

  private pollHandle: number;

  constructor(private symbolGroupApi: SymbolGroupApiService,
              private appStore: AppStoreService,
              private toastService: ToastService,
              private testApi: TestApiService,
              private promptService: PromptService,
              private modalService: NgbModal,
              private settingsApi: SettingsApiService,
              private downloadService: DownloadService,
              public clipboardService: ClipboardService,
              private testReportApi: TestReportApiService,
              private notificationService: NotificationService,
              private testConfigApi: TestConfigApiService,
              private testPresenceService: TestPresenceService) {
    this.testConfigs = [];
    this.selectedTests = new Selectable<any, any>(t => t.id);
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.selectedTests.addItems(this.testSuite.tests);

    this.testConfigApi.getAll(this.project.id).subscribe({
      next: testConfigs => {
        this.testConfigs = testConfigs;
        const i = this.testConfigs.findIndex(c => c.default);
        if (i > -1) {
          this.testConfig = testConfigs[i];
          this.testConfig.environment = this.project.getEnvironmentById(this.testConfig.environment.id);
        } else {
          this.testConfig = new TestExecutionConfig();
          this.testConfig.environment = this.project.getDefaultEnvironment();
        }
      },
      error: console.error
    });

    this.testApi.getRoot(this.project.id).subscribe(r => this.root = r);

    this.testPresenceService.accessedTests$.subscribe(tests => {
      this.lockInfo = tests;
    });
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.pollHandle);
  }

  createTestSuite(): void {
    this.promptService.prompt('Enter a name for the test suite.')
      .then((name) => {
        const testSuite = {
          type: 'suite',
          name,
          project: this.project.id,
          parent: this.testSuite.id,
          tests: []
        };
        this.testApi.create(testSuite).subscribe({
          next: data => {
            this.toastService.success(`The test suite "${testSuite.name}" has been created.`);
            this.testSuite.tests.push(data);
            this.selectedTests.addItem(data);
          },
          error: res => this.toastService.danger('The test suite could not be created. ' + res.error.message)
        });
      });
  }

  createTestCase(): void {
    this.promptService.prompt('Enter a name for the test case.')
      .then((name) => {
        const testCase = TestCase.fromData({
          name,
          project: this.project.id,
          parent: this.testSuite.id
        });
        this.testApi.create(testCase).subscribe(
          data => {
            this.toastService.success(`The test case "${testCase.name}" has been created.`);
            this.testSuite.tests.push(data);
            this.selectedTests.addItem(data);
          },
          res => this.toastService.danger('The test suite could not be created. ' + res.error.message)
        );
      });
  }

  editTest(test: any): void {
    this.promptService.prompt(`Update the name for the test.`, {defaultValue: test.name})
      .then((name) => {
        if (name === test.name) {
          return;
        }

        const testToUpdate = JSON.parse(JSON.stringify(test));
        testToUpdate.name = name;
        if (testToUpdate.type === 'suite') {
          testToUpdate.tests = test.tests.map(t => t.id);
          delete testToUpdate.tests;
        } else {
          testToUpdate.steps = testToUpdate.steps.map((step) => {
            step.pSymbol.symbol = {id: step.pSymbol.symbol.id};
            return step;
          });
          testToUpdate.preSteps = testToUpdate.preSteps.map((step) => {
            step.pSymbol.symbol = {id: step.pSymbol.symbol.id};
            return step;
          });
          testToUpdate.postSteps = testToUpdate.postSteps.map((step) => {
            step.pSymbol.symbol = {id: step.pSymbol.symbol.id};
            return step;
          });
        }

        this.testApi.update(testToUpdate).subscribe(
          () => {
            this.toastService.success('The name has been updated.');
            test.name = name;
          },
          res => this.toastService.danger(`The test ${test.type} could not be updated. ${res.error.message}`)
        );
      });
  }

  deleteTest(test: any): void {
    this.testApi.remove(test).subscribe(
      () => {
        this.toastService.success(`The test ${test.type} has been deleted.`);
        remove(this.testSuite.tests, {id: test.id});
        this.selectedTests.remove(test);
      },
      res => this.toastService.danger(`The test ${test.type} could not be deleted. ${res.error.message}`)
    );
  }

  deleteSelected(): void {
    const selectedTests = this.selectedTests.getSelected();
    if (selectedTests.length === 0) {
      this.toastService.info('You have to select at least one test case or test suite.');
      return;
    }

    this.testApi.removeMany(this.project.id, selectedTests).subscribe(
      () => {
        this.toastService.success('The tests have been deleted.');
        selectedTests.forEach(test => remove(this.testSuite.tests, {id: test.id}));
        this.selectedTests.removeMany(selectedTests);
      },
      res => this.toastService.danger(`Deleting the tests failed. ${res.error.message}`)
    );
  }

  moveSelected(): void {
    const selectedTests = this.selectedTests.getSelected();
    if (selectedTests.length === 0) {
      this.toastService.info('You have to select at least one test.');
      return;
    }

    const modalRef = this.modalService.open(TestsMoveModalComponent);
    modalRef.componentInstance.tests = JSON.parse(JSON.stringify(selectedTests));
    modalRef.result.then(() => {
      this.testApi.get(this.project.id, this.testSuite.id).subscribe(
        testSuite => {
          this.testSuite = testSuite;
          this.selectedTests.updateAll(this.testSuite.tests);
        }
      );
    }).catch(() => {
    });
  }

  executeSelected(): void {
    const selectedTests = this.selectedTests.getSelected();

    const config = JSON.parse(JSON.stringify(this.testConfig));
    config.tests = selectedTests.map(t => t.id);

    this.report = null;
    this.testStatus = null;
    window.clearTimeout(this.pollHandle);

    this.testApi.executeMany(this.project.id, config).subscribe(
      status => {
        this.toastService.success(`The test execution has been started.`);
        this.pollTestReport(status.report.id);
      },
      res => {
        this.toastService.danger(`The test execution failed. ${res.error.message}`);
      }
    );
  }

  showInProgressLabel(test: any): boolean {
    return this.testStatus != null
      && this.testStatus.currentTest != null
      && this.report != null
      && this.report.status === TestReportStatus.IN_PROGRESS
      && this.testStatus.currentTest.id === test.id;
  }

  openTestConfigModal(): void {
    const modalRef = this.modalService.open(TestConfigModalComponent);
    if (this.testConfig != null) {
      modalRef.componentInstance.configuration = JSON.parse(JSON.stringify(this.testConfig));
    }
    modalRef.componentInstance.project = this.project;
    modalRef.result.then(config => {
      this.testConfig = config;
      this.toastService.success(`Config has been saved for the moment.`);
      }).catch(() => {
    });
  }

  copyTests(): void {
    const tests = this.selectedTests.getSelected();
    if (tests.length > 0) {
      this.testApi.export(this.project.id, {testIds: tests.map(t => t.id)}).subscribe((data: any) => {
        this.clipboardService.copy(this.project.id, 'tests', data.tests);
        this.toastService.info('Tests copied to clipboard.');
      });
    } else {
      this.toastService.info('You have to select at least one test');
    }
  }

  pasteTests(): void {
    const tests = this.clipboardService.paste(this.project.id, 'tests');
    if (tests != null) {
      tests.forEach(t => t.parent = this.testSuite.id);
      this.testApi.import(this.project.id, tests).subscribe(
        (importedTests: any[]) => {
          importedTests.forEach((t) => {
            t.type = t.tests ? 'suite' : 'case';
            this.testSuite.tests.push(t);
          });
          this.selectedTests.addItems(importedTests);
          this.toastService.success(`Pasted tests from clipboard.`);
        },
        res => {
          this.toastService.danger(`Could not paste tests in this suite. ${res.error.message}`);
        }
      );
    } else {
      this.toastService.info('There are not tests in the clipboard.');
    }
  }

  selectTestConfig(config: any): void {
    if (config != null) {
      this.testConfig = JSON.parse(JSON.stringify(config));
      this.testConfig.environment = this.project.environments.find(e => e.id === config.environmentId);
    } else {
      this.testConfig = null;
    }
  }

  selectedContainsLockedItem(): boolean {
    if (this.lockInfo.get(this.appStore.project.id)) {
      return this.selectedTests.getSelected().some(value => this.lockInfo.get(this.appStore.project.id).has(value.id));
    }
    return false;
  }

  isLocked(testId: number): boolean {
    return this.lockInfo?.get(this.project.id)?.has(testId);
  }

  getSuitePath(suite: TestSuite): string {
    return TestCase.getTestPath(this.root, suite);
  }

  private pollTestReport(reportId: number): void {
    const f = () => {
      this.testReportApi.get(this.project.id, reportId).subscribe(
        report => {
          this.report = report;
          this.testApi.getStatus(this.project.id).subscribe(testStatus => {
            this.testStatus = testStatus;
            if (report.status === TestReportStatus.FINISHED || report.status === TestReportStatus.ABORTED) {
              window.clearTimeout(this.pollHandle);
            } else {
              this.pollHandle = window.setTimeout(() => f(), 3000);
            }
          });
        });
    };
    f();
  }

  get orderedTests(): any[] {
    return orderBy(this.testSuite.tests, ['type', 'name'], ['desc', 'asc']);
  }

  get results(): any {
    if (this.report == null || this.report.status === TestReportStatus.PENDING) {
      return {};
    }

    if (this.report.status === TestReportStatus.IN_PROGRESS && this.testStatus?.currentTestRun?.results != null) {
      return this.testStatus.currentTestRun.results;
    }

    const map = {};
    this.report.testResults.forEach(r => map[r.test.id] = r);
    return map;
  }

  get canExecute(): boolean {
    return this.selectedTests.isAnySelected() && TestExecutionConfig.isValid(this.testConfig);
  }
}
