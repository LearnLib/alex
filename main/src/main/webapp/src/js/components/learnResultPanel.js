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

import {learnAlgorithm, events} from "../constants";

/**
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
 */
class LearnResultPanel {

    /**
     * Constructor.
     *
     * @param $scope
     * @param $element
     * @param {DownloadService} DownloadService
     * @param {EventBus} EventBus
     * @param {PromptService} PromptService
     */
    // @ngInject
    constructor($scope, $element, DownloadService, EventBus, PromptService) {
        this.DownloadService = DownloadService;
        this.PromptService = PromptService;

        /**
         * The enum for what is displayed in the panel.
         * @type {{HYPOTHESIS: number, OBSERVATION_TABLE: number, DISCRIMINATION_TREE: number}}
         */
        this.modes = {
            HYPOTHESIS: 0,
            OBSERVATION_TABLE: 1,
            DISCRIMINATION_TREE: 2
        };

        /**
         * Available learn algorithms. Needed for access in the template.
         * @type {Object}
         */
        this.learnAlgorithms = learnAlgorithm;

        /**
         * The layout settings for the displayed hypothesis.
         * @type {null|Object}
         */
        this.layoutSettings = null;

        /**
         * The mode that is used.
         * @type {number}
         */
        this.mode = this.modes.HYPOTHESIS;

        /**
         * The index of the step from the results that should be shown.
         * @type {number}
         */
        this.pointer = this.result.steps.length - 1;

        $scope.$watch(() => this.from, () => {
            const from = this.from || 1;
            const index = this.index || 0;
            $element.children()[0].style.width = (100 / from) + '%';
            $element.children()[0].style.left = ((100 / from) * (index)) + '%';
        });

        $scope.$watch(() => this.result, () => {
            if (this.result) this.pointer = this.result.steps.length - 1;
        });

        // wait for hypothesis layout settings to change
        EventBus.on(events.HYPOTHESIS_LAYOUT_UPDATED, (evt, data) => {
            this.layoutSettings = data.settings;
        }, $scope);
    }

    /**
     * Checks if the property 'algorithmInformation' is define which holds the internal data structure
     * for the algorithm of a learn result.
     *
     * @returns {boolean|*}
     */
    hasInternalDataStructure() {
        return this.result.algorithm !== learnAlgorithm.TTT;
    }

    /**
     * Switches the mode to the one to display the internal data structure.
     */
    showInternalDataStructure() {
        switch (this.result.algorithm) {
            case learnAlgorithm.LSTAR:
                this.mode = this.modes.OBSERVATION_TABLE;
                break;
            case learnAlgorithm.DISCRIMINATION_TREE:
                this.mode = this.modes.DISCRIMINATION_TREE;
                break;
            default:
                break;
        }
    }

    /**
     * Downloads the visible hypothesis as json.
     */
    exportHypothesisAsJson() {
        this.PromptService.prompt("Enter a name for the json file")
            .then(filename => {
                this.DownloadService.downloadObject(this.result.steps[this.pointer].hypothesis, filename);
            });
    }

    /**
     * Switches the mode to the one to display the hypothesis.
     */
    showHypothesis() {
        this.mode = this.modes.HYPOTHESIS;
    }

    /**
     * Downloads an observation table.
     *
     * @param {string} selector - The selector of the observation table.
     */
    downloadObservationTable(selector) {
        this.PromptService.prompt("Enter a name for the csv file")
            .then(filename => {
                this.DownloadService.downloadTable(selector, filename);
            });
    }

    /**
     * Downloads the discrimination tree or the hypothesis.
     *
     * @param {string} selector - The selector of the dt pr hypothesis.
     */
    downloadSvg(selector) {
        this.PromptService.prompt("Enter a name for the svg file")
            .then(filename => {
                this.DownloadService.downloadSvg(selector, true, filename);
            });
    }

    /**
     * Shows the first result of the test process.
     */
    firstStep() {
        this.pointer = 0;
    }

    /**
     * Shows the previous result of the test process or the last if the first one is displayed.
     */
    previousStep() {
        if (this.pointer - 1 < 0) {
            this.lastStep();
        } else {
            this.pointer--;
        }
    }

    /**
     * Shows the next result of the test process or the first if the last one is displayed.
     */
    nextStep() {
        if (this.pointer + 1 > this.result.steps.length - 1) {
            this.firstStep();
        } else {
            this.pointer++;
        }
    }

    /**
     * Shows the last result of the test process.
     */
    lastStep() {
        this.pointer = this.result.steps.length - 1;
    }
}

export const learnResultPanel = {
    templateUrl: 'html/components/learn-result-panel.html',
    transclude: true,
    controller: LearnResultPanel,
    controllerAs: 'vm',
    bindings: {
        result: '=',
        index: '@',
        from: '@'
    }
};