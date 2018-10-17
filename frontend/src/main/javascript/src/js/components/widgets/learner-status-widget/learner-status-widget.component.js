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

/**
 * The directive of the dashboard widget that displays the current status of the learner.
 */
class LearnerStatusWidgetComponent {

    /**
     * Constructor.
     *
     * @param $interval
     * @param {LearnerResource} LearnerResource
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor($interval, LearnerResource, ToastService) {
        this.$interval = $interval;
        this.LearnerResource = LearnerResource;
        this.ToastService = ToastService;

        /**
         * The status of the learner.
         * @type {Object}
         */
        this.status = null;

        /**
         * The current project.
         * @type {Project}
         */
        this.project = null;

        /**
         * The interval handle
         * @type {?number}
         */
        this.intervalHandle = null;
    }

    $onInit() {
        this.getStatus();
        this.intervalHandle = this.$interval(() => this.getStatus(), 5000);
    }

    $onDestroy() {
        this.$interval.cancel(this.intervalHandle);
    }

    getStatus() {
        this.LearnerResource.getStatus(this.project.id)
            .then(status => this.status = status)
            .catch(console.error);
    }

    /**
     * Induces the Learner to stop learning after the current hypothesis model.
     */
    abort() {
        this.LearnerResource.stop(this.project.id)
            .then(() => {
                this.ToastService.info('The learner stops as soon as possible.');
            })
            .catch(console.error);
    }
}

export const learnerStatusWidgetComponent = {
    template: require('./learner-status-widget.component.html'),
    bindings: {
        project: '='
    },
    controller: LearnerStatusWidgetComponent,
    controllerAs: 'vm'
};
