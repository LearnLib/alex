/*
 * Copyright 2016 TU Dortmund
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

            this.variable = {name: '', value: ''};

            /**
             * The browser configuration.
             * @type {object}
             */
            this.browserConfig = DriverConfigService.createFromName(webBrowser.HTML_UNIT);

            SymbolGroupResource.getAll(this.project.id, true)
                .then((groups) => this.groups = groups)
                .catch(console.log);

            SettingsResource.getSupportedWebDrivers()
                .then((data) => {
                    this.browserConfig = DriverConfigService.createFromName(data.defaultWebDriver);
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

        createVariable() {
            if (this.variable.name.trim() !== '') {
                this.testCase.variables[this.variable.name] = this.variable.value;
                this.variable = {name: '', value: ''};
            }
        }

        /**
         * Save the state of the test case.
         */
        save() {
            const test = JSON.parse(JSON.stringify(this.testCase));
            test.steps = test.steps.map((step) => {
                if (step.type === 'symbol') {
                    step.symbol = step.symbol.id;
                }
                return step;
            });
            this.TestResource.update(test)
                .then(() => this.ToastService.success('The test case has been updated.'))
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

            this.result = null;
            this.TestResource.execute(this.testCase, this.browserConfig)
                .then((data) => this.result = data[this.testCase.id])
                .catch((err) => this.ToastService.info('The test case could not be executed. ' + err.data.message));
        }

        openBrowserConfigModal() {
            this.$uibModal.open({
                component: 'browserConfigModal',
                resolve: {
                    modalData: () => ({
                        configuration: JSON.parse(JSON.stringify(this.browserConfig))
                    })
                }
            }).result.then(data => {
                this.ToastService.success('The settings have been updated.');
                this.browserConfig = data;
            });
        }

        addSymbolStep(symbol) {
            this.testCase.steps.push({
                type: 'symbol',
                symbol: {
                    id: symbol.id,
                    name: symbol.name
                }
            });
        }

        addActionStep(action) {
            this.testCase.steps.push({
                type: 'action',
                action: action
            });
        }

        openActionEditModal(action, index) {
            this.$uibModal.open({
                component: 'actionEditModal',
                resolve: {
                    modalData: () => ({
                        action: this.ActionService.create(JSON.parse(JSON.stringify(action)))
                    })
                }
            }).result.then((updatedAction) => {
                this.testCase.steps[index].action = updatedAction;
            })
        }

    }
};
