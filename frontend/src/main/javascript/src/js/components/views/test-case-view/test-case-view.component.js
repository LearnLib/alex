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

export const testCaseViewComponent = {
    template: require('./test-case-view.component.html'),
    bindings: {
        testCase: '='
    },
    controllerAs: 'vm',

    /**
     * The controller of the view.
     */
    controller: class {

        /**
         * Constructor.
         *
         * @param $scope
         * @param $state
         * @param dragulaService
         * @param {SymbolGroupResource} SymbolGroupResource
         * @param {SessionService} SessionService
         * @param {ToastService} ToastService
         * @param {TestResource} TestResource
         * @param {LearnerResource} LearnerResource
         * @param $uibModal
         * @param {SettingsResource} SettingsResource
         * @param {ActionService} ActionService
         */
        // @ngInject
        constructor($scope, $state, dragulaService, SymbolGroupResource, SessionService, ToastService, TestResource,
                    LearnerResource, $uibModal, SettingsResource, ActionService) {
            this.$state = $state;
            this.ToastService = ToastService;
            this.TestResource = TestResource;
            this.LearnerResource = LearnerResource;
            this.$uibModal = $uibModal;
            this.ActionService = ActionService;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = SessionService.getProject();

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

            /**
             * The browser configuration.
             * @type {object}
             */
            this.testConfig = {
                tests: [],
                url: this.project.getDefaultUrl(),
                driverConfig: DriverConfigService.createFromName(webBrowser.HTML_UNIT),
            };

            SymbolGroupResource.getAll(this.project.id, true)
                .then((groups) => this.groups = groups)
                .catch(console.log);

            SettingsResource.getSupportedWebDrivers()
                .then((data) => {
                    this.testConfig.driverConfig = DriverConfigService.createFromName(data.defaultWebDriver);
                })
                .catch(console.log);

            dragulaService.options($scope, 'testSymbols', {
                removeOnSpill: false,
                mirrorContainer: document.createElement('div')
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
            test.steps = test.steps.map((step) => {
                step.pSymbol.symbol = step.pSymbol.symbol.id;
                return step;
            });
            test.preSteps = test.preSteps.map((step) => {
                step.pSymbol.symbol = step.pSymbol.symbol.id;
                return step;
            });
            test.postSteps = test.postSteps.map((step) => {
                step.pSymbol.symbol = step.pSymbol.symbol.id;
                return step;
            });
            this.TestResource.update(test)
                .then(updatedTestCase => {
                    this.ToastService.success('The test case has been updated.');
                    this.testCase = updatedTestCase;
                })
                .catch((err) => this.ToastService.danger('The test case could not be updated. ' + err.data.message));
        }

        /**
         * Execute the test case.
         */
        execute() {
            if (!this.testCase.steps.length) {
                this.ToastService.info('You have to create at least one symbol.');
                return;
            }

            const config = JSON.parse(JSON.stringify(this.testConfig));
            config.tests = [this.testCase.id];
            config.url = config.url.id;

            this.result = null;
            this.TestResource.execute(this.testCase, config)
                .then((data) => this.result = data.testResults[0])
                .catch((err) => this.ToastService.info('The test case could not be executed. ' + err.data.message));
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

        addSymbolStep(symbol) {
            this.testCase.steps.push(TestCaseStep.fromSymbol(symbol));
        }
    }
};
