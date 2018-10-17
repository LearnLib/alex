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

import {Counter} from '../../../entities/counter';

/**
 * The component for the modal that creates new counters.
 * @type {{templateUrl: string, bindings: {dismiss: string, close: string, resolve: string}, controllerAs: string, controller: counterCreateModal.controller}}
 */
export const counterCreateModalComponent = {
    template: require('./counter-create-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controllerAs: 'vm',
    controller: class CounterCreateModalComponent {

        /**
         * Constructor.
         *
         * @param projectService
         * @param counterResource
         * @param toastService
         */
        // @ngInject
        constructor(projectService, counterResource, toastService) {
            this.counterResource = counterResource;
            this.toastService = toastService;
            this.projectService = projectService;

            /**
             * The new counter.
             * @type {Counter}
             */
            this.counter = new Counter({project: this.project.id, value: 0});

            /**
             * An error message that can be displayed in the modal template.
             * @type {String|null}
             */
            this.errorMessage = null;
        }

        /**
         * Creates a new counter and closes the modal on success and passes the newly created counter.
         */
        createCounter() {
            this.errorMessage = null;

            if (this.resolve.counters.find(c => c.name === this.counter.name)) {
                this.errorMessage = `The counter with the name ${this.counter.name} already exists.`;
                return;
            }

            this.counterResource.create(this.project.id, this.counter)
                .then(counter => {
                    this.toastService.success(`The counter <strong>${counter.name}</strong> has been created.`);
                    this.close({$value: counter});
                })
                .catch(response => {
                    this.errorMessage = response.data.message;
                });
        }

        get project() {
            return this.projectService.store.currentProject;
        }
    },
};
