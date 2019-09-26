/*
 * Copyright 2015 - 2019 TU Dortmund
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

import * as remove from 'lodash/remove';
import { Selectable } from '../../../utils/selectable';
import { Project } from '../../../entities/project';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { CounterResource } from '../../../services/resources/counter-resource.service';
import { Counter } from '../../../entities/counter';

/**
 * The controller for the page that lists all counters of a project in a list. It is also possible to delete them.
 */
export const countersViewComponent = {
  template: require('./counters-view.component.html'),
  controllerAs: 'vm',
  controller: class CountersViewComponent {

    /** The counters of the project. */
    public counters: Counter[];

    /** The selected counters. */
    public selectedCounters: Selectable<Counter>;

    /** The counter to edit. */
    public counterUnderEdit: Counter;

    /**
     * Constructor.
     *
     * @param projectService
     * @param counterResource
     * @param toastService
     * @param $uibModal
     */
    /* @ngInject */
    constructor(private projectService: ProjectService,
                private counterResource: CounterResource,
                private toastService: ToastService,
                private $uibModal: any) {

      this.counters = [];
      this.selectedCounters = new Selectable(this.counters, 'id');
      this.counterUnderEdit = null;

      // load all existing counters from the server
      this.counterResource.getAll(this.project.id)
        .then(counters => {
          this.counters = counters;
          this.selectedCounters = new Selectable(this.counters, 'id');
        })
        .catch(console.error);
    }

    /**
     * Delete a counter from the server and on success from scope.
     *
     * @param counter The counter that should be deleted.
     */
    deleteCounter(counter: Counter): void {
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
    deleteSelectedCounters(): void {
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
     * @param counter The counter to edit.
     */
    setCounterUnderEdit(counter: Counter): void {
      this.counterUnderEdit = counter.copy();
    }

    /**
     * Create a new counter.
     */
    createCounter(): void {
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
    updateCounter(): void {
      this.counterResource.update(this.project.id, this.counterUnderEdit)
        .then(() => {
          this.counters.find(c => c.id === this.counterUnderEdit.id).value = this.counterUnderEdit.value;
          this.toastService.success('The counter has been updated.');
          this.counterUnderEdit = null;
        })
        .catch(err => this.toastService.danger(`The counter could not be updated. ${err.data.message}`));
    }

    private _deleteCounter(counter): void {
      remove(this.counters, {id: counter.id});
      this.selectedCounters.unselect(counter);
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
