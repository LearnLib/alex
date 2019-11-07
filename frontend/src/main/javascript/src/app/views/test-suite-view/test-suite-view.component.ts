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

import { remove } from 'lodash';
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
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestsImportModalComponent } from './tests-import-modal/tests-import-modal.component';
import { TestConfigModalComponent } from '../tests-view/test-config-modal/test-config-modal.component';
import { TestsMoveModalComponent } from './tests-move-modal/tests-move-modal.component';
import { orderBy } from 'lodash';

@Component({
  selector: 'test-suite-view',
  templateUrl: './test-suite-view.component.html'
})
export class TestSuiteViewComponent implements OnInit {

  /** The test suite. */
  @Input()
  testSuite: any;

  /** The result map (id -> result) of the test execution. */
  results: any;

  /** The test report. */
  report: any;

  /** The driver configuration. */
  testConfig: any;

  groups: SymbolGroup[];

  status: any;

  testConfigs: any[];

  selectedTests: Selectable<any, any>;

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
    this.results = {};
    this.testConfigs = [];
    this.selectedTests = new Selectable([], t => t.id);
    this.groups = [];

    this.status = {
      active: false
    };
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
      createReport: true,
      description: ""
    };

    this.settingsApi.getSupportedWebDrivers().subscribe(
      data => this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver),
      console.error
    );

    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => this.groups = groups,
      console.error
    );

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

    // check if a test process is active
    this.testApi.getStatus(this.project.id).subscribe(
      data => {
        this.status = data;
        if (data.active) {
          this._pollStatus();
        }
      }
    );
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

  reset(): void {
    this.results = {};
  }

  deleteTest(test: any): void {
    this.reset();

    this.testApi.remove(test).subscribe(
      () => {
        this.toastService.success(`The test ${test.type} has been deleted.`);
        remove(this.testSuite.tests, {id: test.id});
        this.selectedTests.unselect(test);
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

    this.reset();

    this.testApi.removeMany(this.project.id, selectedTests).subscribe(
      () => {
        this.toastService.success('The tests have been deleted.');
        selectedTests.forEach(test => remove(this.testSuite.tests, {id: test.id}));
        this.selectedTests.unselectAll();
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
    }).catch(() => {});
  }

  executeSelected(): void {
    const selectedTests = this.selectedTests.getSelected();
    if (selectedTests.length === 0) {
      this.toastService.info('You have to select at least one test case or test suite.');
      return;
    }

    this.reset();

    const config = JSON.parse(JSON.stringify(this.testConfig));
    config.tests = selectedTests.map(t => t.id);
    config.environment = config.environment.id;

    this.testApi.executeMany(this.project.id, config).subscribe(
      () => {
        this.toastService.success(`The test execution has been started.`);
        if (!this.status.active) {
          this._pollStatus();
        }
      },
      res => {
        this.toastService.danger(`The test execution failed. ${res.error.message}`);
      }
    );
  }

  _pollStatus(): void {
    this.status.active = true;
    this.report = null;

    const poll = (wait) => {
      window.setTimeout(() => {
        this.testApi.getStatus(this.project.id).subscribe(
          data => {
            this.status = data;
            if (data.report != null) {
              data.report.testResults.forEach((result) => {
                this.results[result.test.id] = result;
              });
              this.report = data.report;
            }
            if (!data.active) {

              this.toastService.success('The test process finished');
              this.notificationService.notify('ALEX has finished executing the tests.');

              this.testReportApi.getLatest(this.project.id).subscribe(
                data => {
                  data.testResults.forEach((result) => {
                    this.results[result.test.id] = result;
                  });
                  this.report = data;
                },
                console.error
              );
            } else {
              poll(3000);
            }
          });
      }, wait);
    };

    poll(100);
  }

  abortTesting(): void {
    this.testApi.abort(this.project.id).subscribe(
      () => this.toastService.success('The testing process has been aborted.'),
      res => this.toastService.danger(`Could not abort the testing process. ${res.error.message}`)
    );
  }

  openTestConfigModal(): void {
    const modalRef = this.modalService.open(TestConfigModalComponent);
    modalRef.componentInstance.configuration = JSON.parse(JSON.stringify(this.testConfig));
    modalRef.componentInstance.project = this.project;
    modalRef.result.then(data => {
      this.toastService.success('The settings have been updated.');
      this.testConfig = data;
    }).catch(() => {});
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
    }).catch(() => {});
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
}
