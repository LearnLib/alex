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
import { ToastService } from '../../../services/toast.service';
import { LtsFormulaService } from '../../../services/lts-formula.service';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The component for the modal that edits a formula.
 */
export const ltsFormulaEditModalComponent = {
  template: require('html-loader!./lts-formula-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class LtsFormulaEditModalComponent extends ModalComponent {

    /** The formula to edit. */
    public formula: any;

    /** An error message that can be displayed in the modal template. */
    public errorMessage: string;

    /* @ngInject */
    constructor(private appStore: AppStoreService,
                private toastService: ToastService,
                private ltsFormulaService: LtsFormulaService) {
      super();

      this.formula = {};
      this.errorMessage = null;
    }

    $onInit(): void {
      this.formula = this.resolve.formula;
    }

    /**
     * Creates a new counter and closes the modal on success and passes the newly created counter.
     */
    updateFormula(): void {
      this.errorMessage = null;

      this.ltsFormulaService.update(this.formula)
        .then(updatedFormula => {
          this.toastService.success(`The formula has been updated.`);
          this.close({$value: updatedFormula});
        })
        .catch(err => {
          this.errorMessage = err.data.message;
        });
    }

    get project(): Project {
      return this.appStore.project;
    }
  }
};
