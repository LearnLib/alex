/*
 * Copyright 2015 - 2020 TU Dortmund
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
import { webBrowser } from '../../constants';
import { DriverConfigService } from '../../services/driver-config.service';
import { DateUtils } from '../../utils/date-utils';
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
import { SymbolGroup } from '../../entities/symbol-group';
import { TestCase } from '../../entities/test-case';
import { AppStoreService } from '../../services/app-store.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestsImportModalComponent } from './tests-import-modal/tests-import-modal.component';
import { TestConfigModalComponent } from '../tests-view/test-config-modal/test-config-modal.component';
import { TestsMoveModalComponent } from './tests-move-modal/tests-move-modal.component';
import { TestReportStatus, TestStatus } from '../../entities/test-status';

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

  groups: SymbolGroup[];

  testConfigs: any[];

  selectedTests: Selectable<any, any>;

  testStatus: TestStatus;

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
              private testConfigApi: TestConfigApiService) {
    this.testConfigs = [];
    this.selectedTests = new Selectable<any, any>(t => t.id);
    this.groups = [];
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.selectedTests.addItems(this.testSuite.tests);

    this.testConfig = {
      tests: [],
      environment: this.project.getDefaultEnvironment(),
      driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
      description: ""
    };

    this.settingsApi.getSupportedWebDrivers().subscribe(
      data => {
        this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver);
        this.testConfigApi.getAll(this.project.id).subscribe(
          testConfigs => {
            this.testConfigs = testConfigs;
            const i = this.testConfigs.findIndex(c => c.default);
            if (i > -1) {
              this.testConfig = this.testConfigs[i];
            }
          },
          console.error
        );
      },
      console.error
    );

    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => this.groups = groups,
      console.error
    );
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.pollHandle);
  }

  createTestSuite(): void {
    this.promptService.prompt('Enter a name for the test suite.')
      .then((name) => {
        const testSuite = {
          type: 'suite',
          name: name,
          project: this.project.id,
          parent: this.testSuite.id,
          tests: []
        };
        this.testApi.create(testSuite).subscribe(
          data => {
            this.toastService.success(`The test suite "${testSuite.name}" has been created.`);
            this.testSuite.tests.push(data);
            this.selectedTests.addItem(data);
          },
          res => this.toastService.danger('The test suite could not be created. ' + res.error.message)
        );
      });
  }

  createTestCase(): void {
    this.promptService.prompt('Enter a name for the test case.')
      .then((name) => {
        const testCase = TestCase.fromData({
          name: name,
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
    this.promptService.prompt(`Update the name for the test.`, test.name)
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
    config.environment = config.environment.id;

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
      && this.testStatus.currentTest.id === test.id
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

  openTestConfigModal(): void {
    const modalRef = this.modalService.open(TestConfigModalComponent);
    modalRef.componentInstance.configuration = JSON.parse(JSON.stringify(this.testConfig));
    modalRef.componentInstance.project = this.project;
    modalRef.result.then(data => {
      this.toastService.success('The settings have been updated.');
      this.testConfig = data;
    }).catch(() => {
    });
  }

  /**
   * Downloads the tests as JSON file.
   */
  exportSelectedTests(): void {
    let tests = this.selectedTests.getSelected();
    if (!tests.length) {
      this.toastService.info('You have to select at least one test.');
    } else {
      const name = `tests-${this.testSuite.name}-${DateUtils.YYYYMMDD()}`;
      this.promptService.prompt('Enter a name for the file', name).then(name => {
        this.testApi.export(this.project.id, {testIds: tests.map(t => t.id)}).subscribe(data => {
          this.downloadService.downloadObject(data, name);
          this.toastService.success('The tests have been exported.');
        });
      });
    }
  }

  importTests(): void {
    const modalRef = this.modalService.open(TestsImportModalComponent);
    modalRef.componentInstance.parent = this.testSuite;
    modalRef.result.then(tests => {
      this.toastService.success('Tests have been imported.');
      tests.forEach(t => {
        t.type = t.tests ? 'suite' : 'case';
        this.testSuite.tests.push(t);
      });
    }).catch(() => {
    });
  }

  copyTests(): void {
    let tests = this.selectedTests.getSelected();
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

  saveTestConfig(): void {
    const config = JSON.parse(JSON.stringify(this.testConfig));
    config.id = null;
    config.driverConfig.id = null;
    config.tests = [];
    config.project = this.project.id;
    config.environment = config.environment.id;

    this.testConfigApi.create(this.project.id, config).subscribe(
      createdConfig => {
        this.testConfigs.push(createdConfig);
        this.toastService.success('Config has been saved');
      },
      res => {
        this.toastService.danger(`The config could not be saved. ${res.error.message}`);
      }
    );
  }

  selectTestConfig(config: any): void {
    if (config != null) {
      this.testConfig = JSON.parse(JSON.stringify(config));
      this.testConfig.environment = this.project.environments.find(e => e.id === config.environment);
    }
  }

  get orderedTests(): any[] {
    return orderBy(this.testSuite.tests, ['type', 'name'], ['desc', 'asc']);
  }

  get results(): any {
    if (this.report == null || this.report.status === TestReportStatus.PENDING) {
      return {};
    }

    if (this.report.status === TestReportStatus.IN_PROGRESS && this.testStatus != null) {
      return this.testStatus.currentTestRun.results;
    }

    const map = {};
    this.report.testResults.forEach(r => map[r.test.id] = r);
    return map;
  }
}
