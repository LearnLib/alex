/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { LearnerResult } from '../../../entities/learner-result';
import { ToastService } from '../../../services/toast.service';
import { Project } from '../../../entities/project';
import { flatMap, uniqueId } from 'lodash';
import { AppStoreService } from '../../../services/app-store.service';
import { Component, Input, OnInit } from '@angular/core';
import { LtsFormulaSuiteApiService } from '../../../services/api/lts-formula-suite-api.service';
import { ModelCheckerApiService } from '../../../services/api/model-checker-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { flatten } from '@angular/compiler';

/** Panel view for model checking. */
@Component({
  selector: 'learner-result-panel-checking-view',
  templateUrl: './learner-result-panel-checking-view.component.html',
  styleUrls: ['../learner-result-panel.component.scss']
})
export class LearnerResultPanelCheckingViewComponent implements OnInit {

  @Input()
  result: LearnerResult;

  @Input()
  pointer: number;

  selectedFormulas: Selectable<any, any>;
  config: any;
  results: any;

  formulaSuites: any[] = [];

  addFormulaForm = new FormGroup({
    formula: new FormControl('', [Validators.required])
  });

  tmpFormulaSuite = {
    name: 'Custom Formulas',
    formulas: []
  };

  constructor(private toastService: ToastService,
              private appStore: AppStoreService,
              private modelCheckerApi: ModelCheckerApiService,
              private ltsFormulaSuiteApi: LtsFormulaSuiteApiService) {

    this.selectedFormulas = new Selectable((f) => f.id);
    this.results = {};

    this.config = {
      minUnfolds: 3,
      multiplier: 1.0,
      formulas: [],
      learnerResultId: null,
      stepNo: null
    };
  }

  ngOnInit(): void {
    this.ltsFormulaSuiteApi.getAll(this.project.id)
      .subscribe(suites => {
        this.formulaSuites = suites;
        const formulas = flatMap(suites, s => s.formulas);
        this.selectedFormulas.addItems(formulas);
      });
  }

  addManualFormula() {
    const formula = {
      formula: this.addFormulaForm.controls.formula.value,
      id: -1 * Number(uniqueId()),
    };
    this.tmpFormulaSuite.formulas.push(formula);
    this.selectedFormulas.addItem(formula);
    this.selectedFormulas.select(formula);
    this.addFormulaForm.reset();
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

    this.modelCheckerApi.check(this.project.id, this.config).subscribe(
      data => {
        data.forEach(f => this.results[f.formula.id] = f);
      },
      res => this.toastService.danger(`Could not check formulas. ${res.error.message}`)
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

  get allFormulaSuites(): any[] {
    if (this.tmpFormulaSuite.formulas.length === 0) {
      return this.formulaSuites;
    } else {
      return flatten([this.tmpFormulaSuite, this.formulaSuites]);
    }
  }

  get project(): Project {
    return this.appStore.project;
  }
}
