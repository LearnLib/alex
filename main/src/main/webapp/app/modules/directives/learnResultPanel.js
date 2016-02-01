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

import {learnAlgorithm, events} from '../constants';

/**
 * /**
 * The directive that displays a browsable list of learn results. For each result, it can display the observation
 * table, if L* was used, or the Discrimination Tree from the corresponding algorithm.
 *
 * It expects an attribute 'results' which should contain a list of the learn results that should be displayed. It
 * can for example be the list of all intermediate results of a complete test or multiple single results from
 * multiple tests.
 *
 * An additional attribute 'index' can be passed that marks the index of the panel in case there are multiple.
 *
 * Content that is written inside the tag will be displayed a the top right corner beside the index browser. So
 * just add small texts or additional buttons in there.
 *
 * Use it like '<learn-result-panel results="..." index="..."> ... </learn-result-panel>'
 *
 * @param {DownloadService} DownloadService
 * @param {EventBus} EventBus
 * @param {PromptService} PromptService
 * @returns {{scope: {result: string, index: string}, replace: boolean, transclude: boolean, templateUrl: string, controller: *[]}}
 */
// @ngInject
function learnResultPanel(DownloadService, EventBus, PromptService) {
    return {
        scope: {
            result: '=',
            index: '@'
        },
        replace: true,
        transclude: true,
        templateUrl: 'views/directives/learn-result-panel.html',
        controller: ['$scope', link]
    };

    function link(scope) {

        /**
         * The enum for what is displayed in the panel
         * @type {{HYPOTHESIS: number, OBSERVATION_TABLE: number, DISCRIMINATION_TREE: number}}
         */
        scope.modes = {
            HYPOTHESIS: 0,
            OBSERVATION_TABLE: 1,
            DISCRIMINATION_TREE: 2
        };

        /**
         * Available learn algorithms
         * @type {Object}
         */
        scope.learnAlgorithms = learnAlgorithm;

        /**
         * The layout settings for the displayed hypothesis
         * @type {null|Object}
         */
        scope.layoutSettings = null;

        /**
         * The mode that is used
         * @type {number}
         */
        scope.mode = scope.modes.HYPOTHESIS;

        /**
         * The index of the step from the results that should be shown
         * @type {number}
         */
        scope.pointer = scope.result.steps.length - 1;

        // adjust the pointer to show the latest result when learning with sample eq oracle
        scope.$watch('result', result => {
            scope.pointer = result.steps.length - 1;
        });

        // wait for hypothesis layout settings to change
        EventBus.on(events.HYPOTHESIS_LAYOUT_UPDATED, (evt, data) => {
            scope.layoutSettings = data.settings;
        }, scope);

        /**
         * Checks if the property 'algorithmInformation' is define which holds the internal data structure
         * for the algorithm of a learn result
         * @returns {boolean|*}
         */
        scope.hasInternalDataStructure = function () {
            return scope.result.algorithm !== learnAlgorithm.TTT;
        };

        /**
         * Switches the mode to the one to display the internal data structure
         */
        scope.showInternalDataStructure = function () {
            switch (scope.result.algorithm) {
                case learnAlgorithm.LSTAR:
                    scope.mode = scope.modes.OBSERVATION_TABLE;
                    break;
                case learnAlgorithm.DISCRIMINATION_TREE:
                    scope.mode = scope.modes.DISCRIMINATION_TREE;
                    break;
                default:
                    break;
            }
        };

        /**
         * Downloads the visible hypothesis as json
         */
        scope.exportHypothesisAsJson = function () {
            PromptService.prompt("Enter a name for the json file")
                .then(filename => {
                    DownloadService.downloadObject(scope.result.steps[scope.pointer].hypothesis, filename);
                });
        };

        /**
         * Switches the mode to the one to display the hypothesis
         */
        scope.showHypothesis = function () {
            scope.mode = scope.modes.HYPOTHESIS;
        };

        /**
         * Shows the first result of the test process
         */
        scope.firstStep = function () {
            scope.pointer = 0;
        };

        /**
         * Shows the previous result of the test process or the last if the first one is displayed
         */
        scope.previousStep = function () {
            if (scope.pointer - 1 < 0) {
                scope.lastStep();
            } else {
                scope.pointer--;
            }
        };

        /**
         * Shows the next result of the test process or the first if the last one is displayed
         */
        scope.nextStep = function () {
            if (scope.pointer + 1 > scope.result.steps.length - 1) {
                scope.firstStep();
            } else {
                scope.pointer++;
            }
        };

        /**
         * Shows the last result of the test process
         */
        scope.lastStep = function () {
            scope.pointer = scope.result.steps.length - 1;
        };

        /**
         * Downloads an observation table
         * @param {string} selector - The selector of the observation table
         */
        scope.downloadObservationTable = function (selector) {
            PromptService.prompt("Enter a name for the csv file")
                .then(filename => {
                    DownloadService.downloadTable(selector, filename);
                })
        };

        /**
         * Downloads the discrimination tree or the hypothesis
         * @param {string} selector - The selector of the dt pr hypothesis
         */
        scope.downloadSvg = function (selector) {
            PromptService.prompt("Enter a name for the svg file")
                .then(filename => {
                    DownloadService.downloadSvg(selector, true, filename);
                })
        }
    }
}


function learnResultComparePanel() {
    return {
        scope: {
            index: '@',
            from: '@'
        },
        link: link
    };

    function link(scope, el) {
        scope.$watch('from', () => {
            const from = scope.from || 1;
            const index = scope.index || 0;
            el[0].style.width = (100 / from) + '%';
            el[0].style.left = ((100 / from) * (index)) + '%';
        });
    }
}

export {learnResultPanel, learnResultComparePanel};