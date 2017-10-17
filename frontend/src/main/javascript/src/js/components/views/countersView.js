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

import remove from "lodash/remove";

/**
 * The controller for the page that lists all counters of a project in a list. It is also possible to delete them.
 */
class CountersView {

    /**
     * Constructor.
     *
     * @param {SessionService} SessionService
     * @param {CounterResource} CounterResource
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(SessionService, CounterResource, ToastService) {
        this.CounterResource = CounterResource;
        this.ToastService = ToastService;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The counters of the project.
         * @type {Counter[]}
         */
        this.counters = [];

        /**
         * The selected counters objects.
         * @type {Counter[]}
         */
        this.selectedCounters = [];

        // load all existing counters from the server
        this.CounterResource.getAll(this.project.id)
            .then(counters => {
                this.counters = counters;
            })
            .catch(err => console.log(err));
    }


    /**
     * Delete a counter from the server and on success from scope.
     *
     * @param {Counter} counter - The counter that should be deleted.
     */
    deleteCounter(counter) {
        this.CounterResource.remove(this.project.id, counter)
            .then(() => {
                this.ToastService.success('Counter "' + counter.name + '" deleted');
                remove(this.counters, {name: counter.name});
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Deleting counter "' + counter.name + '" failed</strong></p>' + response.data.message);
            });
    }

    /**
     * Delete all selected counters from the server and on success from scope.
     */
    deleteSelectedCounters() {
        if (this.selectedCounters.length > 0) {
            this.CounterResource.removeMany(this.project.id, this.selectedCounters)
                .then(() => {
                    this.ToastService.success('Counters deleted');
                    this.selectedCounters.forEach(counter => {
                        remove(this.counters, {name: counter.name});
                    });
                })
                .catch(response => {
                    this.ToastService.danger('<p><strong>Deleting counters failed</strong></p>' + response.data.message);
                });
        }
    }
}

export const countersView = {
    controller: CountersView,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/counters-view.html'
};