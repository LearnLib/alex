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

import {LearnResult} from '../../../entities/learner-result';

/**
 * The controller for showing a load screen during the learning and shows all learn results from the current test
 * in the intermediate steps.
 */
class LearnerViewComponentComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param $interval
     * @param {SessionService} SessionService
     * @param {LearnerResource} LearnerResource
     * @param {LearnResultResource} LearnResultResource
     * @param {ToastService} ToastService
     * @param {SymbolResource} SymbolResource
     * @param {NotificationService} NotificationService
     */
    // @ngInject
    constructor($state, $interval, SessionService, LearnerResource, LearnResultResource, ToastService, SymbolResource,
                NotificationService) {
        this.$interval = $interval;
        this.$state = $state;
        this.LearnerResource = LearnerResource;
        this.LearnResultResource = LearnResultResource;
        this.ToastService = ToastService;
        this.SymbolResource = SymbolResource;
        this.NotificationService = NotificationService;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The interval that is used for polling.
         * @type {?number}
         */
        this.intervalHandle = null;

        /**
         * The interval time for polling.
         * @type {number}
         */
        this.intervalTime = 5000;

        /**
         * The current step number.
         * @type {number}
         */
        this.stepNo = 1;

        /**
         * The resume configuration.
         * @type {?Object}
         */
        this.resumeConfig = null;

        /**
         * The symbols.
         * @type {AlphabetSymbol[]}
         */
        this.symbols = [];

        /**
         * The current learner status.
         * @type {?Object}
         */
        this.status = null;

        /**
         * The final learner result of the process.
         * @type {?LearnResult}
         */
        this.finalResult = null;

        /**
         * If the learning process finished.
         * @type {boolean}
         */
        this.finished = false;

        this.SymbolResource.getAll(this.project.id)
            .then(symbols => this.symbols = symbols)
            .catch(console.error);

        if (this.$state.params.result !== null) {
            this.finished = true;
            this.finalResult = this.$state.params.result;
            this.stepNo = this.finalResult.steps.length;

            this.resumeConfig = {
                eqOracle: this.finalResult.steps[this.stepNo - 1].eqOracle,
                maxAmountOfStepsToLearn: this.finalResult.steps[this.stepNo - 1].stepsToLearn,
                stepNo: this.stepNo,
                symbolsToAdd: [],
                project: this.project.id,
                urls: this.finalResult.urls,
            };
        } else {
            this.poll();
        }
    }

    $onDestroy() {
        if (this.intervalHandle != null) {
            this.$interval.cancel(this.intervalHandle);
        }
    }

    /**
     * Checks every x seconds if the server has finished learning and sets the test if he did.
     */
    poll() {
        this.finished = false;
        this.getStatus();
        this.intervalHandle = this.$interval(() => this.getStatus(), this.intervalTime);
    }

    getStatus() {
        this.LearnerResource.getStatus(this.project.id)
            .then(status => {
                this.status = status;

                if (!this.status.active) {
                    this.finished = true;

                    this.LearnResultResource.getLatest(this.project.id)
                        .then(latestResult => {
                            if (latestResult.error) {
                                this.$state.go('error', {message: latestResult.errorText});
                            } else {
                                this.finalResult = latestResult;

                                const lastStep = this.finalResult.steps[this.finalResult.steps.length - 1];
                                this.resumeConfig = {
                                    eqOracle: lastStep.eqOracle,
                                    maxAmountOfStepsToLearn: lastStep.stepsToLearn,
                                    stepNo: lastStep.stepNo,
                                    symbolsToAdd: [],
                                    project: this.project.id,
                                    urls: this.finalResult.urls
                                };
                            }

                            this.ToastService.success('The learning process finished');
                            this.NotificationService.notify('ALEX has finished learning the application.');
                        })
                        .catch(console.error);

                    this.$interval.cancel(this.intervalHandle);
                } else {
                    LearnResult.convertNsToMs(this.status.result.statistics.duration);
                }
            })
            .catch(console.error);
    }

    /**
     * Tell the server to continue learning with the new or old learn configuration when eqOracle type was 'sample'.
     */
    resumeLearning() {
        const config = JSON.parse(JSON.stringify(this.resumeConfig));
        config.urls = this.resumeConfig.urls.map(u => u.id);

        this.LearnerResource.resume(this.project.id, this.finalResult.testNo, config)
            .then(() => {
                this.finalResult = null;
                this.stepNo = this.resumeConfig.stepNo;
                this.status = null;
                this.poll();
            })
            .catch(err => {
                this.ToastService.danger('<p><strong>Resume learning failed!</strong></p>' + err.data.message);
            });
    }

    /**
     * Tell the learner to stop learning at the next possible time, when the next hypothesis is generated.
     */
    abort() {
        if (this.status.active) {
            this.ToastService.info('The learner will stop after executing the current query batch');
            this.LearnerResource.stop(this.project.id);
        }
    }
}

export const learnerViewComponent = {
    controller: LearnerViewComponentComponent,
    controllerAs: 'vm',
    template: require('./learner-view.component.html')
};
