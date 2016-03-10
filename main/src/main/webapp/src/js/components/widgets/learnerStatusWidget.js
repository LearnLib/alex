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

/**
 * The directive of the dashboard widget that displays the current status of the learner
 *
 * Use: <widget title="...">
 *          <learner-status-widget></learner-status-widget>
 *      </widget>
 */
// @ngInject
class LearnerStatusWidget {

    /**
     * Constructor
     * @param LearnerResource
     * @param ToastService
     */
    constructor(LearnerResource, ToastService) {
        this.LearnerResource = LearnerResource;
        this.ToastService = ToastService;

        /**
         * Whether the learner is actively learning an application
         * @type {boolean}
         */
        this.isActive = false;

        /**
         * Whether the learner has finished learning an application
         * @type {boolean}
         */
        this.hasFinished = false;

        /**
         * The intermediate or final learning result
         * @type {null|LearnResult}
         */
        this.result = null;

        this.LearnerResource.isActive()
            .then(data => {
                this.isActive = data.active;
                if (!data.active) {
                    this.LearnerResource.getStatus()
                        .then(data => {
                            if (data !== null) {
                                this.hasFinished = true;
                                this.result = data;
                            }
                        });
                }
            });
    }

    /** Induces the Learner to stop learning after the current hypothesis model */
    abort() {
        this.LearnerResource.stop().then(() => {
            this.ToastService.info('The Learner stops with the next hypothesis');
        });
    }
}

const learnerStatusWidget = {
    controller: LearnerStatusWidget,
    controllerAs: 'vm',
    template: `
        <widget title="Learner status">
            <div class="alert alert-info no-margin-bottom" ng-if="!vm.isActive && !vm.hasFinished">
                The Learner is not active. <a ui-sref="learnerSetup">Start learning</a> your application!
            </div>
            <div class="alert alert-info no-margin-bottom" ng-if="!vm.isActive && vm.hasFinished">
                The Learner is not active and created a model.
                <a ui-sref="learnerStart">Refine it</a>,
                <a ui-sref="resultsCompare({testNos: [vm.result.testNo]})">have a look at it</a> or
                <a ui-sref="learnerSetup">Start a new test!</a>
            </div>
            <div class="alert alert-warning no-margin-bottom clearfix" ng-if="vm.isActive">
                The Learner is currently learning an application. <hr>
                <button class="btn btn-xs btn-warning pull-right" ng-click="vm.abort()">Abort</button>
            </div>
        </widget>
    `
};

export default learnerStatusWidget;