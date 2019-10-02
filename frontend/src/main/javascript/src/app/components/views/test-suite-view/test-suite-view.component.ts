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
import { webBrowser } from '../../../constants';
import { DriverConfigService } from '../../../services/driver-config.service';
import { DateUtils } from '../../../utils/date-utils';
import { Selectable } from '../../../utils/selectable';
import { SymbolGroupApiService } from '../../../services/resources/symbol-group-api.service';
import { ToastService } from '../../../services/toast.service';
import { TestApiService } from '../../../services/resources/test-resource.service';
import { PromptService } from '../../../services/prompt.service';
import { SettingsApiService } from '../../../services/resources/settings-api.service';
import { DownloadService } from '../../../services/download.service';
import { ClipboardService } from '../../../services/clipboard.service';
import { NotificationService } from '../../../services/notification.service';
import { TestConfigApiService } from '../../../services/resources/test-config-api.service';
import { TestReportApiService } from '../../../services/resources/test-report-api.service';
import { Project } from '../../../entities/project';
import { SymbolGroup } from '../../../entities/symbol-group';
import { TestCase } from '../../../entities/test-case';
import { AppStoreService } from '../../../services/app-store.service';

export const testSuiteViewComponent = {
  template: require('html-loader!./test-suite-view.component.html'),
  bindings: {
    testSuite: '='
  },
  controllerAs: 'vm',

  /**
   * The controller of the view.
   */
  controller: class TestSuiteViewComponent {

    /** The test suite. */
    public testSuite: any;

    /** The result map (id -> result) of the test execution. */
    public results: any;

    /** The test report. */
    public report: any;

    /** The driver configuration. */
    public testConfig: any;

    public groups: SymbolGroup[];

    public status: any;

    public testConfigs: any[];

    public selectedTests: Selectable<any>;

    /* @ngInject */
    constructor(private $state: any,
                private symbolGroupApi: SymbolGroupApiService,
                private appStore: AppStoreService,
                private toastService: ToastService,
                private testApi: TestApiService,
                private promptService: PromptService,
                private $uibModal: any,
                private settingsApi: SettingsApiService,
                private downloadService: DownloadService,
                private clipboardService: ClipboardService,
                private testReportApi: TestReportApiService,
                private notificationService: NotificationService,
                private testConfigApi: TestConfigApiService) {

      this.testSuite = null;
      this.results = {};
      this.report = null;
      this.testConfigs = [];
      this.selectedTests = new Selectable([], 'id');
      this.groups = [];

      this.status = {
        active: false
      };

      this.testConfig = {
        tests: [],
        environment: this.project.getDefaultEnvironment(),
        driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
        createReport: true
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
        testConfigs => this.testConfigs = testConfigs,
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

    $onInit(): void {
      this.selectedTests = new Selectable(this.testSuite.tests, 'id');
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
            err => this.toastService.danger('The test suite could not be created. ' + err.data.message)
          );
        });
    }

    createTestCase(): void {
      this.promptService.prompt('Enter a name for the test case.')
        .then((name) => {
          const testCase = TestCase.fromData({
            name: name,
            project: this.project.id,
            parent: this.testSuite.id,
          });
          this.testApi.create(testCase).subscribe(
            data => {
              this.toastService.success(`The test case "${testCase.name}" has been created.`);
              this.testSuite.tests.push(data);
            },
            err => this.toastService.danger('The test suite could not be created. ' + err.data.message)
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
            err => this.toastService.danger(`The test ${test.type} could not be updated. ${err.data.message}`)
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
        err => this.toastService.danger(`The test ${test.type} could not be deleted. ${err.data.message}`)
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
        err => this.toastService.danger(`Deleting the tests failed. ${err.data.message}`)
      );
    }

    moveSelected(): void {
      const selectedTests = this.selectedTests.getSelected();
      if (selectedTests.length === 0) {
        this.toastService.info('You have to select at least one test.');
        return;
      }

      this.$uibModal.open({
        component: 'testsMoveModal',
        resolve: {
          tests: () => JSON.parse(JSON.stringify(selectedTests))
        }
      }).result.then(() => {
        this.testApi.get(this.project.id, this.testSuite.id).subscribe(
          testSuite => {
            this.testSuite = testSuite;
            this.selectedTests.updateAll(this.testSuite.tests);
          }
        );
      });
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
        err => {
          this.toastService.danger(`The test execution failed. ${err.data.message}`);
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
        err => this.toastService.danger(`Could not abort the testing process. ${err.data.message}`)
      );
    }

    openTestConfigModal(): void {
      this.$uibModal.open({
        component: 'testConfigModal',
        resolve: {
          configuration: () => JSON.parse(JSON.stringify(this.testConfig)),
          project: () => this.project
        }
      }).result.then(data => {
        this.toastService.success('The settings have been updated.');
        this.testConfig = data;
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

    exportForSelenium(): void {
      let tests = this.selectedTests.getSelected();
      if (!tests.length) {
        this.toastService.info('You have to select at least one test.');
      } else {
        const ts = JSON.parse(JSON.stringify(this.testSuite));
        ts.tests = tests;
        const name = `tests-selenium-${this.testSuite.name}-${DateUtils.YYYYMMDD()}`;
        this.promptService.prompt('Enter a name for the file', name).then(name => {
          this.downloadService.downloadObject(ts, name);
          this.toastService.success('The tests have been exported.');
        });
      }
    }

    importTests(): void {
      this.$uibModal.open({
        component: 'testsImportModal',
        resolve: {
          parent: () => this.testSuite
        }
      }).result.then((tests) => {
        this.toastService.success('Tests have been imported.');
        tests.forEach(t => {
          t.type = t.tests ? 'suite' : 'case';
          this.testSuite.tests.push(t);
        });
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
        this.testApi.import(this.project.id, tests).subscribe((
          importedTests: any[]) => {
            importedTests.forEach((t) => {
              t.type = t.tests ? 'suite' : 'case';
              this.testSuite.tests.push(t);
            });
            this.toastService.success(`Pasted tests from clipboard.`);
          },
          err => {
            this.toastService.danger(`Could not paste tests in this suite. ${err.data.message}`);
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
        err => {
          this.toastService.danger(`The config could not be saved. ${err.data.message}`);
          this.toastService.danger(`The config could not be saved. ${err.data.message}`);
        }
      );
    }

    selectTestConfig(config: any): void {
      if (config != null) {
        this.testConfig = JSON.parse(JSON.stringify(config));
        this.testConfig.environment = this.project.environments.find(e => e.id === config.environment);
      }
    }

    get project(): Project {
      return this.appStore.project;
    }
  }
};
