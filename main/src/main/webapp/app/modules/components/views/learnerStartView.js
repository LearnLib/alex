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

import _ from 'lodash';
import LearnConfiguration from '../../entities/LearnConfiguration';

/**
 * The controller for showing a load screen during the learning and shows all learn results from the current test
 * in the intermediate steps.
 */
// @ngInject
class LearnerStartView {

    /**
     * Constructor
     * @param $scope
     * @param $interval
     * @param SessionService
     * @param LearnerResource
     * @param LearnResultResource
     * @param ToastService
     * @param ErrorService
     */
    constructor($scope, $interval, SessionService, LearnerResource, LearnResultResource, ToastService, ErrorService) {
        this.$interval = $interval;
        this.LearnerResource = LearnerResource;
        this.LearnResultResource = LearnResultResource;
        this.ToastService = ToastService;
        this.ErrorService = ErrorService;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        // The interval object
        this.interval = null;

        // The time for the polling interval in ms
        this.intervalTime = 5000;

        /**
         * The complete learn result until the most recent learned one
         * @type {LearnResult[]}
         */
        this.result = null;

        /**
         * Indicates if polling the server for a test result is still active
         * @type {boolean}
         */
        this.active = false;

        /**
         * Flag for showing or hiding the sidebar
         * @type {boolean}
         */
        this.showSidebar = false;

        /**
         * The amount of executed MQs in the active learn process
         * @type {number}
         */
        this.mqsUsed = null;

        /**
         * The time it took to learn
         * @type {number}
         */
        this.duration = 0;

        this.resumeConfig = null;

        // stop polling when you leave the page
        $scope.$on("$destroy", () => {
            this.$interval.cancel(this.interval);
        });

        this.poll();
    }

    /** Checks every x seconds if the server has finished learning and sets the test if he did */
    poll() {
        this.active = true;
        this.interval = this.$interval(() => {
            this.LearnerResource.isActive()
                .then(data => {
                    if (data.mqsUsed) this.mqsUsed = data.mqsUsed;

                    if (!data.active) {
                        this.LearnerResource.getStatus().then(result => {
                            if (result.error) {
                                this.ErrorService.setErrorMessage(result.errorText);
                            } else {
                                this.result = result;

                                const lastStep = _.last(this.result.steps);
                                this.resumeConfig = {
                                    eqOracle: lastStep.eqOracle,
                                    maxAmountOfStepsToLearn: lastStep.stepsToLearn
                                };
                            }

                            // notify the user that the learning process has finished
                            if (("Notification" in window) && Notification.permission === 'granted') {
                                const notification = new Notification("ALEX has finished learning your application!");
                                setTimeout(notification.close.bind(notification), 5000);
                            }
                        });
                        this.$interval.cancel(this.interval);
                        this.active = false;
                    }

                    if (data.statistics) {
                        this.mqsUsed = data.statistics.mqsUsed;
                        this.duration = Date.now() - Date.parse(data.statistics.startDate);
                    }
                });
        }, this.intervalTime);
    }

    /**
     * Update the configuration for the continuing test when choosing eqOracle 'sample' and showing an intermediate
     * hypothesis
     *
     * @param {LearnConfiguration} config
     */
    updateLearnConfiguration(config) {
        this.test.configuration = config;
    }

    /** Tell the server to continue learning with the new or old learn configuration when eqOracle type was 'sample' */
    resumeLearning() {
        const lastStep = this.result.steps[this.result.steps.length - 1];

        this.LearnerResource.resume(this.project.id, this.result.testNo, config)
            .then(() => {
                this.poll();
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Resume learning failed!</strong></p>' + response.data.message);
            });
    }

    /** Tell the learner to stop learning at the next possible time, when the next hypothesis is generated */
    abort() {
        if (this.active) {
            this.ToastService.info('The learner will stop with the next hypothesis');
            this.LearnerResource.stop();
        }
    }

    /** Shows or hides the sidebar */
    toggleSidebar() {
        this.showSidebar = !this.showSidebar;
    }
}

export const learnerStartView = {
    controller: LearnerStartView,
    controllerAs: 'vm',
    templateUrl: 'views/pages/learner-start.html'
};
