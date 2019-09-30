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

import { ModalComponent } from '../modal.component';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { LtsFormulaService } from '../../../services/lts-formula.service';
import { Project } from '../../../entities/project';

/**
 * The component for the modal that creates new lts formulas.
 */
export const ltsFormulaCreateModalComponent = {
  template: require('html-loader!./lts-formula-create-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class LtsFormulaCreateModalComponent extends ModalComponent {

    /** The new formula. */
    public formula: any;

    /** An error message that can be displayed in the modal template. */
    public errorMessage: string;

    /**
     * Constructor.
     *
     * @param projectService
     * @param toastService
     * @param ltsFormulaService
     */
    /* @ngInject */
    constructor(private projectService: ProjectService,
                private toastService: ToastService,
                private ltsFormulaService: LtsFormulaService) {
      super();

      this.formula = {};
      this.errorMessage = null;
    }

    /**
     * Creates a new counter and closes the modal on success and passes the newly created counter.
     */
    createFormula(): void {
      this.errorMessage = null;

      this.ltsFormulaService.create(this.project.id, this.formula)
        .then(createdFormula => {
          this.toastService.success(`The formula has been created.`);
          this.close({$value: createdFormula});
        })
        .catch(err => {
          this.errorMessage = err.data.message;
        });
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
