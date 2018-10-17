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
         * @param symbolGroupResource
         * @param projectService
         * @param learnerResource
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
        constructor($state, symbolGroupResource, projectService, learnerResource, toastService, testResource,
                    promptService, $uibModal, settingsResource, downloadService, testService, clipboardService,
                    testReportResource, notificationService, testConfigResource) {
            this.$state = $state;
            this.lLearnerResource = learnerResource;
            this.toastService = toastService;
            this.testResource = testResource;
            this.promptService = promptService;
            this.$uibModal = $uibModal;
            this.downloadService = downloadService;
            this.testService = testService;
            this.clipboardService = clipboardService;
            this.testReportResource = testReportResource;
            this.notificationService = notificationService;
            this.$uibModal = $uibModal;
            this.testConfigResource = testConfigResource;
            this.projectService = projectService;

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

            settingsResource.getSupportedWebDrivers()
                .then(data => this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver))
                .catch(console.error);

            symbolGroupResource.getAll(this.project.id, true)
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

        $onInit() {
            this.selectedTests = new Selectable(this.testSuite.tests, 'id');
        }

        createTestSuite() {
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

        createTestCase() {
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

        editTest(test) {
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

        reset() {
            this.results = {};
        }

        deleteTest(test) {
            this.reset();

            this.testResource.remove(test)
                .then(() => {
                    this.toastService.success(`The test ${test.type} has been deleted.`);
                    remove(this.testSuite.tests, {id: test.id});
                    this.selectedTests.unselect(test);
                })
                .catch((err) => this.toastService.danger(`The test ${test.type} could not be deleted. ${err.data.message}`));
        }

        deleteSelected() {
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

        moveSelected() {
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

        executeSelected() {
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

        _pollStatus() {
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

        abortTesting() {
            this.testResource.abort(this.project.id)
                .then(() => this.toastService.success('The testing process has been aborted.'))
                .catch(err => this.toastService.danger(`Could not abort the testing process. ${err.data.message}`));
        }

        openTestConfigModal() {
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
        exportSelectedTests() {
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

        exportForSelenium() {
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

        importTests() {
            this.testService.openImportModal(this.testSuite)
                .then((tests) => {
                    this.toastService.success('Tests have been imported.');
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
                tests = this.testService.exportTests(tests);
                this.clipboardService.copy(this.project.id, 'tests', tests);
                this.toastService.info('Tests copied to clipboard.');
            } else {
                this.toastService.info('You have to select at least one test');
            }
        }

        pasteTests() {
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

        saveTestConfig() {
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
            return this.projectService.store.currentProject;
        }
    }
};
