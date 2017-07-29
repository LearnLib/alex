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

import {LearnResult} from '../../entities/LearnResult';

/**
 * The controller for showing a load screen during the learning and shows all learn results from the current test
 * in the intermediate steps.
 */
class LearnerViewComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param $state
     * @param $interval
     * @param {SessionService} SessionService
     * @param {LearnerResource} LearnerResource
     * @param {LearnResultResource} LearnResultResource
     * @param {ToastService} ToastService
     * @param {ErrorService} ErrorService
     * @param {SymbolResource} SymbolResource
     */
    // @ngInject
    constructor($scope, $state, $interval, SessionService, LearnerResource, LearnResultResource, ToastService,
                ErrorService, SymbolResource) {
        this.$interval = $interval;
        this.$state = $state;
        this.LearnerResource = LearnerResource;
        this.LearnResultResource = LearnResultResource;
        this.ToastService = ToastService;
        this.ErrorService = ErrorService;
        this.SymbolResource = SymbolResource;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The interval that is used for polling.
         * @type {null|number}
         */
        this.interval = null;

        /**
         * The interval time for polling.
         * @type {number}
         */
        this.intervalTime = 5000;

        /**
         * The complete learn result until the most recent learned one.
         * @type {LearnResult[]}
         */
        this.result = null;

        /**
         * Indicates if polling the server for a test result is still active.
         * @type {boolean}
         */
        this.active = false;

        /**
         * Flag for showing or hiding the sidebar.
         * @type {boolean}
         */
        this.showSidebar = true;

        /**
         * Detailed statistics about the active process.
         * @type {any}
         */
        this.statistics = null;

        /**
         * The current step number.
         * @type {number}
         */
        this.stepNo = 1;

        /**
         * The time it took to learn.
         * @type {number}
         */
        this.duration = 0;

        /**
         * The resume configuration.
         * @type {any}
         */
        this.resumeConfig = null;

        /**
         * The current phase of the learner.
         * @type {string}
         */
        this.learnerPhase = null;

        /**
         * The queries that are executed atm by the learner.
         * @type {any[]}
         */
        this.currentQueries = null;

        /** The symbols. */
        this.symbols = [];

        // stop polling when you leave the page
        $scope.$on("$destroy", () => {
            this.$interval.cancel(this.interval);
        });

        this.SymbolResource.getAll(this.project.id)
            .then(symbols => this.symbols = symbols)
            .catch(console.error);

        if (this.$state.params.result !== null) {
            this.result = this.$state.params.result;
            this.stepNo = this.result.steps.length;
            this.resumeConfig = {
                eqOracle: this.result.steps[this.stepNo - 1].eqOracle,
                maxAmountOfStepsToLearn: this.result.steps[this.stepNo - 1].stepsToLearn,
                stepNo: this.stepNo,
                symbolsToAdd: []
            };
        } else {
            this.poll();
        }
    }

    /**
     * Checks every x seconds if the server has finished learning and sets the test if he did.
     */
    poll() {
        this.active = true;
        this.interval = this.$interval(() => {
            this.LearnerResource.isActive()
                .then(data => {
                    this.learnerPhase = data.learnerPhase;
                    this.currentQueries = data.currentQueries;

                    if (data.active) {
                        this.stepNo = data.stepNo;
                        this.LearnResultResource.get(this.project.id, data.testNo)
                            .then(result => this.result = result)
                            .catch(err => console.log(err));
                    }

                    if (!data.active) {
                        this.LearnerResource.getStatus().then(result => {
                            if (result.error) {
                                this.ErrorService.setErrorMessage(result.errorText);
                            } else {
                                this.result = result;

                                const lastStep = this.result.steps[this.result.steps.length - 1];
                                this.resumeConfig = {
                                    eqOracle: lastStep.eqOracle,
                                    maxAmountOfStepsToLearn: lastStep.stepsToLearn,
                                    stepNo: result.steps.length
                                };
                            }

                            // notify the user that the learning process has finished
                            if (("Notification" in window) && Notification.permission === 'granted') {
                                const notification = new Notification('ALEX has finished learning your application!');
                                setTimeout(notification.close.bind(notification), 5000);
                            }
                        });
                        this.$interval.cancel(this.interval);
                        this.active = false;
                    }

                    if (data.statistics) {
                        this.statistics = data.statistics;
                        LearnResult.convertNsToMs(this.statistics.duration);

                        this.duration = Date.now() - Date.parse(data.statistics.startDate);
                    }
                })
                .catch(err => console.log(err));
        }, this.intervalTime);
    }

    /**
     * Update the configuration for the continuing test when choosing eqOracle 'sample' and showing an intermediate
     * hypothesis.
     *
     * @param {LearnConfiguration} config - The updated configuration.
     */
    updateLearnConfiguration(config) {
        this.test.configuration = config;
    }

    /**
     * Tell the server to continue learning with the new or old learn configuration when eqOracle type was 'sample'.
     */
    resumeLearning() {
        this.LearnerResource.resume(this.project.id, this.result.testNo, this.resumeConfig)
            .then(() => {
                this.poll();
                this.stepNo = this.resumeConfig.stepNo;
                this.LearnResultResource.get(this.project.id, this.result.testNo)
                    .then(result => {
                        result.steps.pop();
                        this.result = result;
                    })
                    .catch(err => console.log(err));
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Resume learning failed!</strong></p>' + response.data.message);
            });
    }

    /**
     * Tell the learner to stop learning at the next possible time, when the next hypothesis is generated.
     */
    abort() {
        if (this.active) {
            this.ToastService.info('The learner will stop with the next hypothesis');
            this.LearnerResource.stop();
        }
    }

    /**
     * Shows or hides the sidebar.
     */
    toggleSidebar() {
        this.showSidebar = !this.showSidebar;
    }
}

export const learnerView = {
    controller: LearnerViewComponent,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/learner-view.html'
};
