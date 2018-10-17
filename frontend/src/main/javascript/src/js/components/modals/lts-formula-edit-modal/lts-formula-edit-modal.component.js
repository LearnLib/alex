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
 * The component for the modal that edits a formula.
 */
export const ltsFormulaEditModalComponent = {
    template: require('./lts-formula-edit-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controllerAs: 'vm',
    controller: class LtsFormulaEditModalComponent {

        /**
         * Constructor.
         *
         * @param projectService
         * @param toastService
         * @param ltsFormulaService
         */
        // @ngInject
        constructor(projectService, toastService, ltsFormulaService) {
            this.projectService = projectService;
            this.toastService = toastService;
            this.ltsFormulaService = ltsFormulaService;

            /**
             * The formula to edit.
             * @type {Object}
             */
            this.formula = {};

            /**
             * An error message that can be displayed in the modal template.
             * @type {String|null}
             */
            this.errorMessage = null;
        }

        $onInit() {
            this.formula = this.resolve.formula;
        }

        /**
         * Creates a new counter and closes the modal on success and passes the newly created counter.
         */
        updateFormula() {
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

        get project() {
            return this.projectService.store.currentProject;
        }
    }
};
