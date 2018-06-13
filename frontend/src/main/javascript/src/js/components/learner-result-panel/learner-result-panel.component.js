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

import {events, learnAlgorithm} from '../../constants';

/**
 * The directive that displays a browsable list of learn results. For each result, it can display the observation
 * table, if L* was used, or the Discrimination Tree from the corresponding algorithm.
 *
 * It expects an attribute 'results' which should contain a list of the learn results that should be displayed. It
 * can for example be the list of all intermediate results of a complete test or multiple single results from
 * multiple tests.
 *
 * Content that is written inside the tag will be displayed a the top right corner beside the index browser. So
 * just add small texts or additional buttons in there.
 */
class LearnerResultPanelComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param {DownloadService} DownloadService
     * @param {EventBus} EventBus
     * @param {PromptService} PromptService
     */
    // @ngInject
    constructor($scope, DownloadService, EventBus, PromptService) {
        this.$scope = $scope;
        this.EventBus = EventBus;
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
    }

    $onInit() {

        /**
         * The index of the step from the results that should be shown.
         * @type {number}
         */
        this.pointer = this.result.steps.length - 1;
        this.emitStep();

        this.$scope.$watch(() => this.result, () => {
            if (this.result) this.pointer = this.result.steps.length - 1;
        });

        // wait for hypothesis layout settings to change
        this.EventBus.on(events.HYPOTHESIS_LAYOUT_UPDATED, (evt, data) => {
            this.layoutSettings = data.settings;
        }, this.$scope);
    }

    /**
     * Checks if the property 'algorithmInformation' is define which holds the internal data structure
     * for the algorithm of a learn result.
     *
     * @returns {boolean|*}
     */
    hasInternalDataStructure() {
        return [learnAlgorithm.DT, learnAlgorithm.LSTAR, learnAlgorithm.TTT]
            .indexOf(this.result.algorithm.name) > -1;
    }

    /**
     * Switches the mode to the one to display the internal data structure.
     */
    showInternalDataStructure() {
        switch (this.result.algorithm.name) {
            case learnAlgorithm.LSTAR:
                this.mode = this.modes.OBSERVATION_TABLE;
                break;
            case learnAlgorithm.DT:
                this.mode = this.modes.DISCRIMINATION_TREE;
                break;
            case learnAlgorithm.TTT:
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
        this.PromptService.prompt('Enter a name for the json file')
            .then(filename => {
                this.DownloadService.downloadObject(this.result.steps[this.pointer].hypothesis, filename);
            });
    }

    /**
     * Downloads the visible hypothesis as dot file.
     */
    exportHypothesisAsDot() {
        const hypothesis = this.result.steps[this.pointer].hypothesis;

        const edges = {};
        hypothesis.edges.forEach(edge => {
            if (!edges[edge.from]) {
                edges[edge.from] = {};
            }
            if (!edges[edge.from][edge.to]) {
                edges[edge.from][edge.to] = '';
            }
            edges[edge.from][edge.to] += `${edge.input} / ${edge.output}\\n`;
        });

        let dot = 'digraph g {\n';
        dot += '  __start0 [label="" shape="none"];\n\n';
        hypothesis.nodes.forEach(node => {
            dot += `  ${node} [shape="circle" label="${node}"];\n`;
        });
        dot += '\n';
        for (let from in edges) {
            for (let to in edges[from]) {
                dot += `  ${from} -> ${to} [label="${edges[from][to]}"];\n`;
            }
        }
        dot += '\n';
        dot += '  __start0 -> 0;\n';
        dot += '}';

        this.PromptService.prompt('Enter a name for the dot file')
            .then(filename => this.DownloadService.downloadText(filename, 'dot', dot));
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
        this.PromptService.prompt('Enter a name for the csv file')
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
        this.PromptService.prompt('Enter a name for the svg file')
            .then(filename => {
                this.DownloadService.downloadSvg(selector, true, filename);
            });
    }

    /**
     * Emits the index of the currently shown step.
     */
    emitStep() {
        if (this.index >= 0 && this.onStep()) {
            this.onStep()(this.index, this.pointer);
        }
    }

    /**
     * Shows the first result of the test process.
     */
    firstStep() {
        this.pointer = 0;
        this.emitStep();
    }

    /**
     * Shows the previous result of the test process or the last if the first one is displayed.
     */
    previousStep() {
        if (this.pointer - 1 < 0) {
            this.lastStep();
        } else {
            this.pointer--;
            this.emitStep();
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
            this.emitStep();
        }
    }

    /**
     * Shows the last result of the test process.
     */
    lastStep() {
        this.pointer = this.result.steps.length - 1;
        this.emitStep();
    }
}

export const learnerResultPanelComponent = {
    template: require('./learner-result-panel.component.html'),
    transclude: true,
    controller: LearnerResultPanelComponent,
    controllerAs: 'vm',
    bindings: {
        result: '=',
        index: '=',
        onStep: '&'
    }
};
