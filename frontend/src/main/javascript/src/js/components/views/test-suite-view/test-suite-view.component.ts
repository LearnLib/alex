/*
 * Copyright 2018 TU Dortmund
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

import remove from 'lodash/remove';
import {version} from '../../../../../environments';
import {webBrowser} from '../../../constants';
import {DriverConfigService} from '../../../services/driver-config.service';
import {DateUtils} from '../../../utils/date-utils';
import {Selectable} from '../../../utils/selectable';
import {SymbolGroupResource} from '../../../services/resources/symbol-group-resource.service';
import {ProjectService} from '../../../services/project.service';
import {ToastService} from '../../../services/toast.service';
import {TestResource} from '../../../services/resources/test-resource.service';
import {PromptService} from '../../../services/prompt.service';
import {SettingsResource} from '../../../services/resources/settings-resource.service';
import {DownloadService} from '../../../services/download.service';
import {TestService} from '../../../services/test.service';
import {ClipboardService} from '../../../services/clipboard.service';
import {NotificationService} from '../../../services/notification.service';
import {TestConfigResource} from '../../../services/resources/test-config-resource.service';
import {TestReportResource} from '../../../services/resources/test-report-resource.service';
import {Project} from '../../../entities/project';
import {SymbolGroup} from '../../../entities/symbol-group';

export const testSuiteViewComponent = {
  template: require('./test-suite-view.component.html'),
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

    /**
     * Constructor.
     *
     * @param {$state} $state
     * @param symbolGroupResource
     * @param projectService
     * @param toastService
     * @param testResource
     * @param promptService
     * @param $uibModal
     * @param settingsResource
     * @param downloadService
     * @param testService
     * @param clipboardService
     * @param testReportResource
     * @param notificationService
     * @param testConfigResource
     */
    // @ngInject
    constructor(private $state: any,
                private symbolGroupResource: SymbolGroupResource,
                private projectService: ProjectService,
                private toastService: ToastService,
                private testResource: TestResource,
                private promptService: PromptService,
                private $uibModal: any,
                private settingsResource: SettingsResource,
                private downloadService: DownloadService,
                private testService: TestService,
                private clipboardService: ClipboardService,
                private testReportResource: TestReportResource,
                private notificationService: NotificationService,
                private testConfigResource: TestConfigResource) {

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
        url: this.project.getDefaultUrl(),
        driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
        createReport: true
      };

      this.settingsResource.getSupportedWebDrivers()
        .then(data => this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver))
        .catch(console.error);

      this.symbolGroupResource.getAll(this.project.id, true)
        .then((groups) => this.groups = groups)
        .catch(console.error);

      this.testConfigResource.getAll(this.project.id)
        .then(testConfigs => this.testConfigs = testConfigs)
        .catch(console.error);

      // check if a test process is active
      this.testResource.getStatus(this.project.id)
        .then(data => {
          this.status = data;
          if (data.active) {
            this._pollStatus();
          }
        });
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
          this.testResource.create(testSuite)
            .then(data => {
              this.toastService.success(`The test suite "${testSuite.name}" has been created.`);
              this.testSuite.tests.push(data);
            })
            .catch(err => this.toastService.danger('The test suite could not be created. ' + err.data.message));
        });
    }

    createTestCase(): void {
      this.promptService.prompt('Enter a name for the test case.')
        .then((name) => {
          const testCase = {
            type: 'case',
            name: name,
            project: this.project.id,
            parent: this.testSuite.id,
            steps: []
          };
          this.testResource.create(testCase)
            .then((data) => {
              this.toastService.success(`The test case "${testCase.name}" has been created.`);
              this.testSuite.tests.push(data);
            })
            .catch((err) => this.toastService.danger('The test suite could not be created. ' + err.data.message));
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
            testToUpdate.steps = test.steps.map((step) => {
              step.pSymbol.symbol = step.pSymbol.symbol.id;
              return step;
            });
            testToUpdate.preSteps = testToUpdate.preSteps.map((step) => {
              step.pSymbol.symbol = step.pSymbol.symbol.id;
              return step;
            });
            testToUpdate.postSteps = testToUpdate.postSteps.map((step) => {
              step.pSymbol.symbol = step.pSymbol.symbol.id;
              return step;
            });
          }

          this.testResource.update(testToUpdate)
            .then(() => {
              this.toastService.success('The name has been updated.');
              test.name = name;
            })
            .catch((err) => this.toastService.danger(`The test ${test.type} could not be updated. ${err.data.message}`));
        });
    }

    reset(): void {
      this.results = {};
    }

    deleteTest(test: any): void {
      this.reset();

      this.testResource.remove(test)
        .then(() => {
          this.toastService.success(`The test ${test.type} has been deleted.`);
          remove(this.testSuite.tests, {id: test.id});
          this.selectedTests.unselect(test);
        })
        .catch((err) => this.toastService.danger(`The test ${test.type} could not be deleted. ${err.data.message}`));
    }

    deleteSelected(): void {
      const selectedTests = this.selectedTests.getSelected();
      if (selectedTests.length === 0) {
        this.toastService.info('You have to select at least one test case or test suite.');
        return;
      }

      this.reset();

      this.testResource.removeMany(this.project.id, selectedTests)
        .then(() => {
          this.toastService.success('The tests have been deleted.');
          selectedTests.forEach(test => remove(this.testSuite.tests, {id: test.id}));
          this.selectedTests.unselectAll();
        })
        .catch((err) => this.toastService.danger(`Deleting the tests failed. ${err.data.message}`));
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
        this.testResource.get(this.project.id, this.testSuite.id)
          .then(testSuite => {
            this.testSuite = testSuite;
            this.selectedTests.updateAll(this.testSuite.tests);
          });
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
      config.url = config.url.id;

      this.testResource.executeMany(this.project.id, config)
        .then(() => {
          this.toastService.success(`The test execution has been started.`);
          if (!this.status.active) {
            this._pollStatus();
          }
        })
        .catch((err) => {
          this.toastService.danger(`The test execution failed. ${err.data.message}`);
        });
    }

    _pollStatus(): void {
      this.status.active = true;
      this.report = null;

      const poll = (wait) => {
        window.setTimeout(() => {
          this.testResource.getStatus(this.project.id)
            .then(data => {
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

                this.testReportResource.getLatest(this.project.id)
                  .then(data => {
                    data.testResults.forEach((result) => {
                      this.results[result.test.id] = result;
                    });
                    this.report = data;
                  })
                  .catch(console.error);
              } else {
                poll(3000);
              }
            });
        }, wait);
      };

      poll(100);
    }

    abortTesting(): void {
      this.testResource.abort(this.project.id)
        .then(() => this.toastService.success('The testing process has been aborted.'))
        .catch(err => this.toastService.danger(`Could not abort the testing process. ${err.data.message}`));
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
        tests = JSON.parse(JSON.stringify(tests));
        tests = this.testService.exportTests(tests);

        const data = {
          version,
          type: 'tests',
          tests
        };

        const name = `tests-${this.testSuite.name}-${DateUtils.YYYYMMDD()}`;
        this.promptService.prompt('Enter a name for the file', name).then(name => {
          this.downloadService.downloadObject(data, name);
          this.toastService.success('The tests have been exported.');
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
      this.testService.openImportModal(this.testSuite)
        .then((tests) => {
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
        tests = JSON.parse(JSON.stringify(tests));
        tests = this.testService.exportTests(tests);
        this.clipboardService.copy(this.project.id, 'tests', tests);
        this.toastService.info('Tests copied to clipboard.');
      } else {
        this.toastService.info('You have to select at least one test');
      }
    }

    pasteTests(): void {
      const tests = this.clipboardService.paste(this.project.id, 'tests');
      if (tests != null) {
        this.testService.importTests(this.project.id, tests, this.testSuite.id)
          .then((importedTests) => {
            importedTests.forEach((t) => {
              t.type = t.tests ? 'suite' : 'case';
              this.testSuite.tests.push(t);
            });
            this.toastService.success(`Pasted tests from clipboard.`);
          })
          .catch((err) => {
            this.toastService.danger(`Could not paste tests in this suite. ${err.data.message}`);
          });
      } else {
        this.toastService.info('There are not tests in the clipboard.');
      }
    }

    saveTestConfig(): void {
      let selectedTests = this.selectedTests.getSelected();
      if (!selectedTests.length) {
        this.toastService.info('You have to select at least one test.');
        return;
      }

      const config = JSON.parse(JSON.stringify(this.testConfig));
      config.id = null;
      config.driverConfig.id = null;
      config.tests = selectedTests.map(t => t.id);
      config.project = this.project.id;
      config.url = config.url.id;

      this.testConfigResource.create(this.project.id, config)
        .then(createdConfig => {
          this.testConfigs.push(createdConfig);
          this.toastService.success('Config has been saved');
        })
        .catch(err => {
          this.toastService.danger(`The config could not be saved. ${err.data.message}`);
        });
    }

    selectTestConfig(config: any): void {
      if (config != null) {
        this.testConfig = config;
        this.testSuite.tests.forEach(test => {
          if (this.testConfig.tests.indexOf(test.id) > -1) {
            this.selectedTests.select(test);
          }
        });
      }
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
