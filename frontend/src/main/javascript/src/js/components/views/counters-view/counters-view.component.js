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

import remove from 'lodash/remove';
import {Selectable} from '../../../utils/selectable';

/**
 * The controller for the page that lists all counters of a project in a list. It is also possible to delete them.
 */
class CountersViewComponent {

    /**
     * Constructor.
     *
     * @param projectService
     * @param counterResource
     * @param toastService
     * @param $uibModal
     */
    // @ngInject
    constructor(projectService, counterResource, toastService, $uibModal) {
        this.counterResource = counterResource;
        this.toastService = toastService;
        this.$uibModal = $uibModal;
        this.projectService = projectService;

        /**
         * The counters of the project.
         * @type {Counter[]}
         */
        this.counters = [];

        /**
         * The selected counters.
         * @type {Selectable}
         */
        this.selectedCounters = new Selectable(this.counters, 'name');

        /**
         * The counter to edit.
         * @type {Counter}
         */
        this.counterUnderEdit = null;

        // load all existing counters from the server
        this.counterResource.getAll(this.project.id)
            .then(counters => {
                this.counters = counters;
                this.selectedCounters = new Selectable(this.counters, 'name');
            })
            .catch(err => console.log(err));
    }

    /**
     * Delete a counter from the server and on success from scope.
     *
     * @param {Counter} counter - The counter that should be deleted.
     */
    deleteCounter(counter) {
        this.counterResource.remove(this.project.id, counter)
            .then(() => {
                this.toastService.success('Counter "' + counter.name + '" deleted');
                this._deleteCounter(counter);
            })
            .catch(err => {
                this.toastService.danger('<p><strong>Deleting counter "' + counter.name + '" failed</strong></p>' + err.data.message);
            });
    }

    /**
     * Delete all selected counters from the server and on success from scope.
     */
    deleteSelectedCounters() {
        const selectedCounters = this.selectedCounters.getSelected();
        if (selectedCounters.length > 0) {
            this.counterResource.removeMany(this.project.id, selectedCounters)
                .then(() => {
                    this.toastService.success('Counters deleted');
                    selectedCounters.forEach(counter => this._deleteCounter(counter));
                })
                .catch(err => {
                    this.toastService.danger('<p><strong>Deleting counters failed</strong></p>' + err.data.message);
                });
        } else {
            this.toastService.info('You have to select at least one counter.');
        }
    }

    /**
     * Sets the counter to edit.
     *
     * @param {Counter} counter - The counter to edit.
     */
    setCounterUnderEdit(counter) {
        this.counterUnderEdit = JSON.parse(JSON.stringify(counter));
    }

    /**
     * Create a new counter.
     */
    createCounter() {
        this.$uibModal.open({
            component: 'counterCreateModal',
            resolve: {
                counters: () => this.counters
            }
        }).result.then(createdCounter => this.counters.push(createdCounter));
    }

    /**
     * Update the counter.
     */
    updateCounter() {
        this.counterResource.update(this.project.id, this.counterUnderEdit)
            .then(() => {
                this.counters.find(c => c.name === this.counterUnderEdit.name).value = this.counterUnderEdit.value;
                this.toastService.success('The counter has been updated.');
                this.counterUnderEdit = null;
            })
            .catch(err => this.toastService.danger(`The counter could not be updated. ${err.data.message}`));
    }

    _deleteCounter(counter) {
        remove(this.counters, {name: counter.name});
        this.selectedCounters.unselect(counter);
    }

    get project() {
        return this.projectService.store.currentProject;
    }
}

export const countersViewComponent = {
    controller: CountersViewComponent,
    controllerAs: 'vm',
    template: require('./counters-view.component.html')
};
