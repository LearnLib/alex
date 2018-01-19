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

import {LearnResult} from '../../../entities/learner-result';

/**
 * The controller that handles the page for displaying multiple complete learn results in a slide show.
 */
class ResultsCompareViewComponent {

    /**
     * Constructor.
     *
     * @param $timeout
     * @param $uibModal
     * @param $stateParams
     * @param {SessionService} SessionService
     * @param {LearnResultResource} LearnResultResource
     * @param {ErrorService} ErrorService
     * @param {LearnerResource} LearnerResource
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor($timeout, $uibModal, $stateParams, SessionService, LearnResultResource, ErrorService, LearnerResource,
                ToastService) {
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.LearnResultResource = LearnResultResource;
        this.ErrorService = ErrorService;
        this.LearnerResource = LearnerResource;
        this.ToastService = ToastService;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * All final learn results from all tests that were made for a project.
         * @type {LearnResult[]}
         */
        this.results = [];

        /**
         * The list of active panels where each panel contains a complete learn result set.
         * @type {LearnResult[]}
         */
        this.panels = [];

        /** The indeces of the steps that are displayed. */
        this.panelPointers = [];

        /**
         * The list of layout settings for the current hypothesis that is shown in a panel.
         * @type {Object[]}
         */
        this.layoutSettings = [];

        // load all final learn results of all test an then load the complete test results from the test numbers
        // that are passed from the url in the panels
        if (!$stateParams.testNos) {
            this.ErrorService.setErrorMessage('There are no test numbers defined in the URL');
        } else {
            const testNos = $stateParams.testNos.split(',');
            this.LearnResultResource.getAll(this.project.id)
                .then(results => {
                    this.results = results;
                    this.panels = results.filter((r) => {
                        return testNos.indexOf('' + r.testNo.toString()) > -1;
                    });
                })
                .catch(err => console.log(err));
        }
    }

    /**
     * Loads a complete learn result set from a learn result in the panel with a given index.
     *
     * @param {LearnResult} result - The learn result whose complete set should be loaded in a panel.
     * @param {number} index - The index of the panel the complete set should be displayed in.
     */
    fillPanel(result, index) {
        this.panels[index] = result;
    }

    /**
     * Removes a panel by a given index.
     *
     * @param {number} index - The index of the panel to remove.
     */
    closePanel(index) {
        this.panels[index] = null;
        this.panels.splice(index, 1);
        this.panelPointers.splice(index, 1);
        window.setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }

    /**
     * Get the pointer to the step of the displayed hypotheses.
     * @param {number} index
     * @param {number} pointer
     */
    onStep(index, pointer) {
        this.panelPointers[index] = pointer;
    }

    /**
     * Test if a separating word between the first two displayed hypotheses can be found.
     */
    showSeparatingWord() {
        const hypA = this.panels[0].steps[this.panelPointers[0]].hypothesis;
        const hypB = this.panels[1].steps[this.panelPointers[1]].hypothesis;

        this.LearnerResource.getSeparatingWord(hypA, hypB)
            .then(data => {
                if (data.separatingWord === '') {
                    this.ToastService.info('The two hypotheses are identical');
                } else {
                    this.$uibModal.open({
                        template: `
                            <div class="modal-body">
                                <h4>Separating word</h4>
                                <strong ng-bind="vm.word"></strong>
                            </div>
                            <div class="modal-footer">
                                <a class="btn btn-default btn-sm" ng-click="vm.close()">Close</a>
                            </div>
                        `,
                        resolve: {
                            word: () => data.separatingWord
                        },
                        // @ngInject
                        controller: function ($uibModalInstance, word) {
                            this.word = word;
                            this.close = () => $uibModalInstance.close();
                        },
                        controllerAs: 'vm',
                    });
                }
            })
            .catch(err => this.ToastService.danger(err.data.message));
    }

    /**
     * Gets the difference tree of the two displayed hypotheses
     *
     * @param {number} invert
     */
    showDifferenceTree(invert) {
        let hypLeft = this.panels[0].steps[this.panelPointers[0]].hypothesis;
        let hypRight = this.panels[1].steps[this.panelPointers[1]].hypothesis;

        if (invert) {
            hypLeft = this.panels[1].steps[this.panelPointers[1]].hypothesis;
            hypRight = this.panels[0].steps[this.panelPointers[0]].hypothesis;
        }

        this.LearnerResource.getDifferenceTree(hypLeft, hypRight)
            .then(data => {
                if (data.edges.length === 0) {
                    this.ToastService.info('Cannot find a difference.');
                } else {
                    this.panels.push({hypothesis: data, steps: [{hypothesis: data}]});
                }
            })
            .catch(err => this.ToastService.danger(err.data.message));
    }
}

export const resultsCompareViewComponent = {
    controller: ResultsCompareViewComponent,
    controllerAs: 'vm',
    template: require('./learner-results-compare-view.component.html')
};
