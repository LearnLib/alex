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

import { Selectable } from '../../../utils/selectable';
import { LearnResult } from '../../../entities/learner-result';
import { ToastService } from '../../../services/toast.service';
import { LtsFormulaApiService } from '../../../services/resources/lts-formula-api.service';
import { Project } from '../../../entities/project';
import { Resizer } from '../../../utils/resizer';
import { uniqueId } from 'lodash';
import { AppStoreService } from '../../../services/app-store.service';

/** Panel view for model checking. */
export const learnerResultPanelCheckingViewComponent = {
  template: require('html-loader!./learner-result-panel-checking-view.component.html'),
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
    public manualFormula: string;
    public formulas: any[];

    /* @ngInject */
    constructor(private toastService: ToastService,
                private appStore: AppStoreService,
                private ltsFormulaApi: LtsFormulaApiService,
                private $element: any) {

      this.selectedFormulas = new Selectable([], 'id');
      this.results = {};
      this.formulas = [];

      this.config = {
        minUnfolds: 3,
        multiplier: 1.0,
        formulas: [],
        learnerResultId: null,
        stepNo: null
      };
    }

    $onInit(): void {
      this.registerMenu({menu: []});

      this.ltsFormulaApi.getAll(this.project.id)
        .subscribe(formulas => {
          this.selectedFormulas = new Selectable(formulas, 'id');
          this.formulas = formulas;
        });

      new Resizer(this.$element[0], '.resize', '.right-sidebar');
    }

    addManualFormula() {
      if (this.manualFormula != null && this.manualFormula.trim() !== '') {
        const formula = {
          formula: this.manualFormula,
          id: -1 * Number(uniqueId()),
          projectId: this.project.id
        };
        this.formulas.unshift(formula);
        this.selectedFormulas.select(formula);
        this.manualFormula = '';
      }
    }

    check(): void {
      this.results = {};

      this.config.learnerResultId = this.result.testNo;
      this.config.stepNo = this.pointer + 1;
      this.config.formulas = this.selectedFormulas.getSelected();

      if (this.config.formulas.length === 0) {
        this.toastService.info('You have to specify at least one formula.');
        return;
      }

      this.ltsFormulaApi.check(this.project.id, this.config).subscribe(
        data => {
          data.forEach(f => this.results[f.formula.id] = f);
        },
        err => this.toastService.danger(`Could not check formulas. ${err.data.message}`)
      );
    }

    getItemClass(id: number): any {
      if (this.results[id] == null) {
        return {};
      } else {
        const passed = this.results[id].passed;
        return {'list-group-item-danger': !passed, 'list-group-item-success': passed};
      }
    }

    hasCounterexample(id: number): boolean {
      const result = this.results[id];
      return result != null && ((result.prefix.length + result.loop.length) > 0);
    }

    get project(): Project {
      return this.appStore.project;
    }
  }
};
