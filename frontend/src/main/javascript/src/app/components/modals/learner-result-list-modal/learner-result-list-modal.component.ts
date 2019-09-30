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

import { ProjectService } from '../../../services/project.service';
import { LearnResultResource } from '../../../services/resources/learner-result-resource.service';
import { ToastService } from '../../../services/toast.service';
import { ModalComponent } from '../modal.component';
import { LearnResult } from '../../../entities/learner-result';
import { Project } from '../../../entities/project';

/**
 * The component for the modal that displays a selectable list of results.
 */
export const resultListModalComponent = {
  template: require('html-loader!./learner-result-list-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class ResultListModalComponent extends ModalComponent {

    /** The results of the current project. */
    public results: LearnResult[] = null;

    /**
     * Constructor.
     *
     * @param projectService
     * @param learnResultResource
     * @param toastService
     */
    /* @ngInject */
    constructor(private projectService: ProjectService,
                private learnResultResource: LearnResultResource,
                private toastService: ToastService) {
      super();
      projectService.load();
    }

    $onInit(): void {
      this.results = this.resolve.results;
    }

    /** Switches the view. */
    switchProject(): void {
      this.results = null;
    }

    /**
     * Selects a project of which the learn results should be displayed.
     *
     * @param project The project to display all results from.
     */
    selectProject(project: Project): void {
      this.learnResultResource.getAll(project.id)
        .then(results => this.results = results)
        .catch(err => console.log(err));
    }

    /**
     * Emits the selected result and closes the modal.
     *
     * @param result The selected result.
     */
    selectResult(result: LearnResult): void {
      this.close({$value: result});
    }

    /**
     * Loads a hypothesis from a json file.
     *
     * @param hypothesis The hypothesis as string
     */
    loadResultFromFile(hypothesis: string): void {
      try {
        this.close({$value: {steps: [{hypothesis: JSON.parse(hypothesis)}]}});
      } catch (e) {
        this.toastService.danger('Could not parse the file.');
      }
    }

    get projects(): Project[] {
      return this.projectService.store.projects;
    }
  },
};
