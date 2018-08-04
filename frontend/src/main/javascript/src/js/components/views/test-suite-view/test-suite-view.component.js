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

        /**
         * Constructor.
         *
         * @param {$state} $state
         * @param {SymbolGroupResource} SymbolGroupResource
         * @param {ProjectService} ProjectService
         * @param {LearnerResource} LearnerResource
         * @param {ToastService} ToastService
         * @param {TestResource} TestResource
         * @param {PromptService} PromptService
         * @param $uibModal
         * @param {SettingsResource} SettingsResource
         * @param {DownloadService} DownloadService
         * @param {TestService} TestService
         * @param {ClipboardService} ClipboardService
         * @param {TestReportResource} TestReportResource
         * @param {NotificationService} NotificationService
         * @param {TestConfigResource} TestConfigResource
         */
        // @ngInject
        constructor($state, SymbolGroupResource, ProjectService, LearnerResource, ToastService, TestResource,
                    PromptService, $uibModal, SettingsResource, DownloadService, TestService, ClipboardService,
                    TestReportResource, NotificationService, TestConfigResource) {
            this.$state = $state;
            this.LearnerResource = LearnerResource;
            this.ToastService = ToastService;
            this.TestResource = TestResource;
            this.PromptService = PromptService;
            this.$uibModal = $uibModal;
            this.DownloadService = DownloadService;
            this.TestService = TestService;
            this.ClipboardService = ClipboardService;
            this.TestReportResource = TestReportResource;
            this.NotificationService = NotificationService;
            this.$uibModal = $uibModal;
            this.TestConfigResource = TestConfigResource;
            this.ProjectService = ProjectService;

            /**
             * The test suite.
             * @type {object}
             */
            this.testSuite = null;

            /**
             * The result map (id -> result) of the test execution.
             * @type {object}
             */
            this.results = {};

            /**
             * The test report.
             * @type {object}
             */
            this.report = null;

            this.status = {
                active: false
            };

            this.testConfigs = [];

            this.selectedTests = new Selectable([], 'id');

            /**
             * The driver configuration.
             * @type {Object}
             */
            this.testConfig = {
                tests: [],
                url: this.project.getDefaultUrl(),
                driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
                createReport: true
            };

            SettingsResource.getSupportedWebDrivers()
                .then(data => this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver))
                .catch(console.error);

            SymbolGroupResource.getAll(this.project.id, true)
                .then((groups) => this.groups = groups)
                .catch(console.error);

            this.TestConfigResource.getAll(this.project.id)
                .then(testConfigs => this.testConfigs = testConfigs)
                .catch(console.error);

            // check if a test process is active
            this.TestResource.getStatus(this.project.id)
                .then(data => {
                    this.status = data;
                    if (data.active) {
                        this._pollStatus();
                    }
                });
        }

        $onInit() {
            this.selectedTests = new Selectable(this.testSuite.tests, 'id');
        }

        createTestSuite() {
            this.PromptService.prompt('Enter a name for the test suite.')
                .then((name) => {
                    const testSuite = {
                        type: 'suite',
                        name: name,
                        project: this.project.id,
                        parent: this.testSuite.id,
                        tests: []
                    };
                    this.TestResource.create(testSuite)
                        .then(data => {
                            this.ToastService.success(`The test suite "${testSuite.name}" has been created.`);
                            this.testSuite.tests.push(data);
                        })
                        .catch(err => this.ToastService.danger('The test suite could not be created. ' + err.data.message));
                });
        }

        createTestCase() {
            this.PromptService.prompt('Enter a name for the test case.')
                .then((name) => {
                    const testCase = {
                        type: 'case',
                        name: name,
                        project: this.project.id,
                        parent: this.testSuite.id,
                        steps: []
                    };
                    this.TestResource.create(testCase)
                        .then((data) => {
                            this.ToastService.success(`The test case "${testCase.name}" has been created.`);
                            this.testSuite.tests.push(data);
                        })
                        .catch((err) => this.ToastService.danger('The test suite could not be created. ' + err.data.message));
                });
        }

        editTest(test) {
            this.PromptService.prompt(`Update the name for the test.`, test.name)
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

                    this.TestResource.update(testToUpdate)
                        .then(() => {
                            this.ToastService.success('The name has been updated.');
                            test.name = name;
                        })
                        .catch((err) => this.ToastService.danger(`The test ${test.type} could not be updated. ${err.data.message}`));
                });
        }

        reset() {
            this.results = {};
        }

        deleteTest(test) {
            this.reset();

            this.TestResource.remove(test)
                .then(() => {
                    this.ToastService.success(`The test ${test.type} has been deleted.`);
                    remove(this.testSuite.tests, {id: test.id});
                    this.selectedTests.unselect(test);
                })
                .catch((err) => this.ToastService.danger(`The test ${test.type} could not be deleted. ${err.data.message}`));
        }

        deleteSelected() {
            const selectedTests = this.selectedTests.getSelected();
            if (selectedTests.length === 0) {
                this.ToastService.info('You have to select at least one test case or test suite.');
                return;
            }

            this.reset();

            this.TestResource.removeMany(this.project.id, selectedTests)
                .then(() => {
                    this.ToastService.success('The tests have been deleted.');
                    selectedTests.forEach(test => remove(this.testSuite.tests, {id: test.id}));
                    this.selectedTests.unselectAll();
                })
                .catch((err) => this.ToastService.danger(`Deleting the tests failed. ${err.data.message}`));
        }

        moveSelected() {
            const selectedTests = this.selectedTests.getSelected();
            if (selectedTests.length === 0) {
                this.ToastService.info('You have to select at least one test.');
                return;
            }

            this.$uibModal.open({
                component: 'testsMoveModal',
                resolve: {
                    tests: () => JSON.parse(JSON.stringify(selectedTests))
                }
            }).result.then(() => {
                this.TestResource.get(this.project.id, this.testSuite.id)
                    .then(testSuite => {
                        this.testSuite = testSuite;
                        this.selectedTests.updateAll(this.testSuite.tests);
                    });
            });
        }

        executeSelected() {
            const selectedTests = this.selectedTests.getSelected();
            if (selectedTests.length === 0) {
                this.ToastService.info('You have to select at least one test case or test suite.');
                return;
            }

            this.reset();

            const config = JSON.parse(JSON.stringify(this.testConfig));
            config.tests = selectedTests.map(t => t.id);
            config.url = config.url.id;

            this.TestResource.executeMany(this.project.id, config)
                .then(() => {
                    this.ToastService.success(`The test execution has been started.`);
                    if (!this.status.active) {
                        this._pollStatus();
                    }
                })
                .catch((err) => {
                    this.ToastService.danger(`The test execution failed. ${err.data.message}`);
                });
        }

        _pollStatus() {
            this.status.active = true;
            this.report = null;

            const poll = (wait) => {
                window.setTimeout(() => {
                    this.TestResource.getStatus(this.project.id)
                        .then(data => {
                            this.status = data;
                            if (data.report != null) {
                                data.report.testResults.forEach((result) => {
                                    this.results[result.test.id] = result;
                                });
                                this.report = data.report;
                            }
                            if (!data.active) {

                                this.ToastService.success('The test process finished');
                                this.NotificationService.notify('ALEX has finished executing the tests.');

                                this.TestReportResource.getLatest(this.project.id)
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

        abortTesting() {
            this.TestResource.abort(this.project.id)
                .then(() => this.ToastService.success('The testing process has been aborted.'))
                .catch(err => this.ToastService.danger(`Could not abort the testing process. ${err.data.message}`));
        }

        openTestConfigModal() {
            this.$uibModal.open({
                component: 'testConfigModal',
                resolve: {
                    configuration: () => JSON.parse(JSON.stringify(this.testConfig)),
                    project: () => this.project
                }
            }).result.then(data => {
                this.ToastService.success('The settings have been updated.');
                this.testConfig = data;
            });
        }

        /**
         * Downloads the tests as JSON file.
         */
        exportSelectedTests() {
            let tests = this.selectedTests.getSelected();
            if (!tests.length) {
                this.ToastService.info('You have to select at least one test.');
            } else {
                tests = JSON.parse(JSON.stringify(tests));
                tests = this.TestService.exportTests(tests);

                const data = {
                    version,
                    type: 'tests',
                    tests
                };

                const name = `tests-${this.testSuite.name}-${DateUtils.YYYYMMDD()}`;
                this.PromptService.prompt('Enter a name for the file', name).then(name => {
                    this.DownloadService.downloadObject(data, name);
                    this.ToastService.success('The tests have been exported.');
                });
            }
        }

        importTests() {
            this.TestService.openImportModal(this.testSuite)
                .then((tests) => {
                    this.ToastService.success('Tests have been imported.');
                    tests.forEach(t => {
                        t.type = t.tests ? 'suite' : 'case';
                        this.testSuite.tests.push(t);
                    });
                });
        }

        copyTests() {
            let tests = this.selectedTests.getSelected();
            if (tests.length > 0) {
                tests = JSON.parse(JSON.stringify(tests));
                tests = this.TestService.exportTests(tests);
                this.ClipboardService.copy('tests', tests);
                this.ToastService.info('Tests copied to clipboard.');
            } else {
                this.ToastService.info('You have to select at least one test');
            }
        }

        pasteTests() {
            const tests = this.ClipboardService.paste('tests');
            if (tests != null) {
                this.TestService.importTests(this.project.id, tests, this.testSuite.id)
                    .then((importedTests) => {
                        importedTests.forEach((t) => {
                            t.type = t.tests ? 'suite' : 'case';
                            this.testSuite.tests.push(t);
                        });
                        this.ToastService.success(`Pasted tests from clipboard.`);
                    })
                    .catch((err) => {
                        this.ToastService.danger(`Could not paste tests in this suite. ${err.data.message}`);
                    });
            } else {
                this.ToastService.info('There are not tests in the clipboard.');
            }
        }

        saveTestConfig() {
            let selectedTests = this.selectedTests.getSelected();
            if (!selectedTests.length) {
                this.ToastService.info('You have to select at least one test.');
                return;
            }

            const config = JSON.parse(JSON.stringify(this.testConfig));
            config.id = null;
            config.driverConfig.id = null;
            config.tests = selectedTests.map(t => t.id);
            config.project = this.project.id;
            config.url = config.url.id;

            this.TestConfigResource.create(this.project.id, config)
                .then(createdConfig => {
                    this.testConfigs.push(createdConfig);
                    this.ToastService.success('Config has been saved');
                })
                .catch(err => {
                    this.ToastService.danger(`The config could not be saved. ${err.data.message}`);
                });
        }

        selectTestConfig(config) {
            if (config != null) {
                this.testConfig = config;
                this.testSuite.tests.forEach(test => {
                    if (this.testConfig.tests.indexOf(test.id) > -1) {
                        this.selectedTests.select(test);
                    }
                });
            }
        }

        get project() {
            return this.ProjectService.store.currentProject;
        }
    }
};
