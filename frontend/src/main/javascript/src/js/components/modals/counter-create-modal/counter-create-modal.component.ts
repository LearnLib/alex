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
import {ProjectService} from '../../../services/project.service';
import {CounterResource} from '../../../services/resources/counter-resource.service';
import {ToastService} from '../../../services/toast.service';
import {Project} from '../../../entities/project';
import {ModalComponent} from '../modal.component';

/**
 * The component for the modal that creates new counters.
 */
export const counterCreateModalComponent = {
  template: require('./counter-create-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class CounterCreateModalComponent extends ModalComponent {

    /** The counter to create. */
    public counter: Counter;

    /** The message to display if there is an error. */
    public errorMessage: string;

    /**
     * Constructor.
     *
     * @param projectService
     * @param counterResource
     * @param toastService
     */
    /* @ngInject */
    constructor(private projectService: ProjectService,
                private counterResource: CounterResource,
                private toastService: ToastService) {
      super();

      this.counter = new Counter({project: this.project.id, value: 0});
      this.errorMessage = null;
    }

    /**
     * Creates a new counter and closes the modal on success and passes the newly created counter.
     */
    createCounter(): void {
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

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  },
};
