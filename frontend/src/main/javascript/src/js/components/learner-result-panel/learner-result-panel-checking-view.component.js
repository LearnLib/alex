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

import {Selectable} from '../../utils/selectable';

/** Panel view for model checking. */
export const learnerResultPanelCheckingViewComponent = {
    template: require('./learner-result-panel-checking-view.component.html'),
    bindings: {
        registerMenu: '&',
        layoutSettings: '=',
        result: '=',
        pointer: '='
    },
    controllerAs: 'vm',
    controller: class LearnerResultPanelCheckingViewComponent {

        /**
         * Constructor.
         *
         * @param {ToastService} ToastService
         * @param {ProjectService} ProjectService
         * @param {LtsFormulaService} LtsFormulaService
         * @param {LtsFormulaResource} LtsFormulaResource
         */
        // @ngInject
        constructor(ToastService, ProjectService, LtsFormulaService, LtsFormulaResource) {
            this.toastService = ToastService;
            this.projectService = ProjectService;
            this.ltsFormulaService = LtsFormulaService;
            this.ltsFormulaResource = LtsFormulaResource;

            this.selectedFormulas = new Selectable([], 'id');

            this.config = {
                minUnfolds: 3,
                multiplier: 1.0,
                formulaIds: [],
                learnerResultId: null,
                stepNo: null
            };

            this.results = {};
        }

        $onInit() {
            this.registerMenu({menu: []});

            this.ltsFormulaService.load(this.project.id)
                .then(formulas => this.selectedFormulas = new Selectable(formulas, 'id'));
        }

        check() {
            this.config.learnerResultId = this.result.testNo;
            this.config.stepNo = this.pointer;
            this.config.formulaIds = this.selectedFormulas.getSelected().map(f => f.id);

            if (this.config.formulaIds.length === 0) {
                this.toastService.info('You have to specify at least one formula.');
                return;
            }

            this.ltsFormulaResource.check(this.project.id, this.config)
                .then(res => this.results = res.data)
                .catch(err => this.toastService.danger(`Could not check formulas. ${err.data.message}`));
        }

        get project() {
            return this.projectService.store.currentProject;
        }

        get formulas() {
            return this.ltsFormulaService.store.ltsFormulas;
        }
    }
};
