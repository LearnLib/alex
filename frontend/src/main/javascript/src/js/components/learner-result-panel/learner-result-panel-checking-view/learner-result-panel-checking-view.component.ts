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

import {Selectable} from '../../../utils/selectable';
import {LearnResult} from '../../../entities/learner-result';
import {ToastService} from '../../../services/toast.service';
import {ProjectService} from '../../../services/project.service';
import {LtsFormulaService} from '../../../services/lts-formula.service';
import {LtsFormulaResource} from '../../../services/resources/lts-formula-resource.service';
import {Project} from '../../../entities/project';

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

    public registerMenu: (menu: any) => void;
    public layoutSettings: any;
    public result: LearnResult;
    public pointer: number;

    public selectedFormulas: Selectable<any>;
    public config: any;
    public results: any;

    /**
     * Constructor.
     *
     * @param toastService
     * @param projectService
     * @param ltsFormulaService
     * @param ltsFormulaResource
     */
    // @ngInject
    constructor(private toastService: ToastService,
                private projectService: ProjectService,
                private ltsFormulaService: LtsFormulaService,
                private ltsFormulaResource: LtsFormulaResource) {

      this.selectedFormulas = new Selectable([], 'id');
      this.results = {};

      this.config = {
        minUnfolds: 3,
        multiplier: 1.0,
        formulaIds: [],
        learnerResultId: null,
        stepNo: null
      };
    }

    $onInit(): void {
      this.registerMenu({menu: []});

      this.ltsFormulaService.load(this.project.id)
        .then(formulas => this.selectedFormulas = new Selectable(formulas, 'id'));
    }

    check(): void {
      this.results = {};

      this.config.learnerResultId = this.result.testNo;
      this.config.stepNo = this.pointer + 1;
      this.config.formulaIds = this.selectedFormulas.getSelected().map(f => f.id);

      if (this.config.formulaIds.length === 0) {
        this.toastService.info('You have to specify at least one formula.');
        return;
      }

      this.ltsFormulaResource.check(this.project.id, this.config)
        .then(res => this.results = res.data)
        .catch(err => this.toastService.danger(`Could not check formulas. ${err.data.message}`));
    }

    getItemClass(formula: any): any {
      if (this.results[formula.id] == null) {
        return {};
      } else {
        const passed = this.results[formula.id].passed;
        return {'list-group-item-danger': !passed, 'list-group-item-success': passed};
      }
    }

    hasCounterexample(formula: any): boolean {
      const result = this.results[formula.id];
      return result != null && ((result.prefix.length + result.loop.length) > 0);
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }

    get formulas(): any[] {
      return this.ltsFormulaService.store.ltsFormulas;
    }
  }
};
