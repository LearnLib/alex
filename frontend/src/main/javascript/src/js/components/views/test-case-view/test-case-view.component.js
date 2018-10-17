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

import {webBrowser} from '../../../constants';
import {TestCaseStep} from '../../../entities/test-case-step';
import {DriverConfigService} from '../../../services/driver-config.service';
import {SymbolGroupUtils} from '../../../utils/symbol-group-utils';

export const testCaseViewComponent = {
    template: require('./test-case-view.component.html'),
    bindings: {
        testCase: '='
    },
    controllerAs: 'vm',

    /**
     * The controller of the view.
     */
    controller: class TestCaseViewComponent {

        /**
         * Constructor.
         *
         * @param $scope
         * @param $state
         * @param dragulaService
         * @param symbolGroupResource
         * @param projectService
         * @param toastService
         * @param testResource
         * @param learnerResource
         * @param $uibModal
         * @param settingsResource
         * @param actionService
         */
        // @ngInject
        constructor($scope, $state, dragulaService, symbolGroupResource, projectService, toastService, testResource,
                    learnerResource, $uibModal, settingsResource, actionService) {
            this.$state = $state;
            this.toastService = toastService;
            this.testResource = testResource;
            this.learnerResource = learnerResource;
            this.$uibModal = $uibModal;
            this.actionService = actionService;
            this.projectService = projectService;

            /**
             * The current test
             * @type {object}
             */
            this.testCase = null;

            /**
             * The test result.
             * @type {object}
             */
            this.result = null;

            this.report = null;

            /**
             * Map id -> symbol.
             * @type {Object}
             */
            this.symbolMap = {};

            /**
             * If testing is in progress.
             * @type {boolean}
             */
            this.active = false;

            this.options = {
                showSymbolOutputs: false
            };

            /**
             * The browser configuration.
             * @type {Object}
             */
            this.testConfig = {
                tests: [],
                url: this.project.getDefaultUrl(),
                driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
                createReport: true,
            };

            symbolGroupResource.getAll(this.project.id, true)
                .then((groups) => {
                    this.groups = groups;
                    SymbolGroupUtils.getSymbols(this.groups).forEach(s => this.symbolMap[s.id] = s);
                })
                .catch(console.error);

            settingsResource.getSupportedWebDrivers()
                .then((data) => this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver))
                .catch(console.error);

            dragulaService.options($scope, 'testSymbols', {
                removeOnSpill: false,
                mirrorContainer: document.createElement('div'),
                moves: (el, container, handle) => {
                    return handle.classList.contains('handle');
                }
            });

            const keyDownHandler = (e) => {
                if (e.ctrlKey && e.which === 83) {
                    e.preventDefault();
                    this.save();
                    return false;
                }
            };

            window.addEventListener('keydown', keyDownHandler);

            $scope.$on('$destroy', () => {
                dragulaService.destroy($scope, 'testSymbols');
                window.removeEventListener('keydown', keyDownHandler);
            });

            $scope.$on('testSymbols.drag', () => this.result.outputs = []);
        }

        $onInit() {
            this.testConfig.tests = [this.testCase];
        }

        /**
         * Save the state of the test case.
         */
        save() {
            const test = JSON.parse(JSON.stringify(this.testCase));
            this.testResource.update(test)
                .then(updatedTestCase => {
                    this.toastService.success('The test case has been updated.');
                    this.testCase = updatedTestCase;
                })
                .catch((err) => this.toastService.danger('The test case could not be updated. ' + err.data.message));
        }

        /**
         * Execute the test case.
         */
        execute() {
            if (!this.testCase.steps.length) {
                this.toastService.info('You have to create at least one symbol.');
                return;
            }

            const config = JSON.parse(JSON.stringify(this.testConfig));
            config.tests = [this.testCase.id];
            config.url = config.url.id;

            this.result = null;
            this.active = true;
            this.testResource.execute(this.testCase, config)
                .then(data => {
                    this.report = data;
                    this.result = data.testResults[0];
                    this.active = false;
                })
                .catch((err) => {
                    this.toastService.info('The test case could not be executed. ' + err.data.message);
                    this.active = false;
                });
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

        addSymbolStep(symbol) {
            this.testCase.steps.push(TestCaseStep.fromSymbol(symbol));
        }

        get project() {
            return this.projectService.store.currentProject;
        }
    }
};
