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

import {ToastService} from '../../services/toast.service';
import {LtsFormulaService} from '../../services/lts-formula.service';

/**
 * The component for the modal that creates new lts formulas.
 */
export const ltsFormulaListComponent = {
  template: require('./lts-formula-list.component.html'),
  bindings: {
    formulas: '=',
    selectable: '='
  },
  controllerAs: 'vm',
  controller: class LtsFormulaListComponent {

    /**
     * Constructor.
     *
     * @param toastService
     * @param ltsFormulaService
     */
    // @ngInject
    constructor(private toastService: ToastService,
                private ltsFormulaService: LtsFormulaService) {
    }

    /**
     * Delete a formula.
     *
     * @param formula The formula to delete.
     */
    deleteFormula(formula: any): void {
      this.ltsFormulaService.delete(formula)
        .then(() => this.toastService.success('The formula has been deleted.'))
        .catch(err => this.toastService.danger(`The formula could not be deleted. ${err.data.message}`));
    }
  }
};
