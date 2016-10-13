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

export const symbolsTestView = {

    /**
     * The controller of the view.
     */
    controller: class SymbolsTestView {

        /**
         * Constructor.
         *
         * @param $scope
         * @param dragulaService
         * @param {SymbolGroupResource} SymbolGroupResource
         * @param {SessionService} SessionService
         * @param {LearnerResource} LearnerResource
         * @param {ToastService} ToastService
         * @param {SettingsResource} SettingsResource
         */
        // @ngInject
        constructor($scope, SymbolGroupResource, SessionService, LearnerResource, dragulaService, ToastService, SettingsResource) {
            this.LearnerResource = LearnerResource;
            this.ToastService = ToastService;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = SessionService.getProject();

            /**
             * All symbol groups of the project.
             * @type {SymbolGroup[]}
             */
            this.groups = [];

            /**
             * The word to test.
             * @type {AlphabetSymbol[]}
             */
            this.word = [];

            /**
             * If the word is being executed.
             * @type {boolean}
             */
            this.isExecuting = false;

            /**
             * The enum with supported browsers.
             * @type {null|*}
             */
            this.browser = null;

            /**
             * The browser to execute the word in.
             * @type {null|string}
             */
            this.selectedBrowser = null;

            /**
             * The outputs of the executed word.
             * @type {string[]}
             */
            this.outputs = [];

            SymbolGroupResource.getAll(this.project.id, true)
                .then(groups => this.groups = groups);

            SettingsResource.getSupportedBrowserEnum()
                .then(supportedBrowsers => this.browser = supportedBrowsers);

            dragulaService.options($scope, 'word', {
                removeOnSpill: false,
                mirrorContainer: document.createElement('div'),
                moves: function () {
                    return !this.isExecuting;
                }.bind(this),
            });

            $scope.$on('word.drop', () => this.outputs = []);
            $scope.$on('$destroy', () => dragulaService.destroy($scope, 'word'));
        }

        /**
         * Executes the word that has been build.
         */
        executeWord() {
            if (this.selectedBrowser === null) {
                this.ToastService.info("Select a web driver.");
                return;
            }

            this.outputs = [];
            this.isExecuting = true;
            const symbols = this.word.map(s => s.getIdRevisionPair());
            const resetSymbol = symbols.shift();

            const readOutputConfig = {
                symbols: {resetSymbol, symbols},
                browser: this.selectedBrowser
            };

            this.LearnerResource.testWord(this.project.id, readOutputConfig)
                .then(outputs => {
                    this.outputs = outputs;
                })
                .catch(res => {
                    this.ToastService.danger("The word could not be executed. " + res.data.message);
                })
                .finally(() => this.isExecuting = false);
        }
    },
    controllerAs: 'vm',
    templateUrl: 'html/components/views/symbols-test-view.html'
};