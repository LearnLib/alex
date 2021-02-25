/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { Component, OnInit } from '@angular/core';
import { AppStoreService } from '../../services/app-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LtsFormulaApiService } from '../../services/api/lts-formula-api.service';
import { LtsFormulaSuiteApiService } from '../../services/api/lts-formula-suite-api.service';
import { ToastService } from '../../services/toast.service';
import { Project } from '../../entities/project';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateLtsFormulaModalComponent } from './create-lts-formula-modal/create-lts-formula-modal.component';
import { EditLtsFormulaModalComponent } from './edit-lts-formula-modal/edit-lts-formula-modal.component';
import { Selectable } from '../../utils/selectable';
import { removeItems, replaceItem } from '../../utils/list-utils';
import { MoveLtsFormulaModalComponent } from './move-lts-formula-modal/move-lts-formula-modal.component';

@Component({
  selector: 'lts-formula-suite-view',
  templateUrl: './lts-formula-suite-view.component.html'
})
export class LtsFormulaSuiteViewComponent implements OnInit {

  suite: any;
  formulasSelectable: Selectable<any, number>;

  constructor(private appStore: AppStoreService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formulaApiService: LtsFormulaApiService,
              private toastService: ToastService,
              private modalService: NgbModal,
              private formulaSuiteApiService: LtsFormulaSuiteApiService) {
    this.formulasSelectable = new Selectable<any, number>(f => f.id);
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      params => {
        const redirect = () => this.router.navigate(['/app', 'projects', this.project.id , 'lts-formula-suites']);

        if (!params.has('suiteId')) {
          this.toastService.info('Could not find formula suite id in URL');
          redirect();
        } else {
          this.formulaSuiteApiService.get(this.project.id, Number(params.get('suiteId'))).subscribe(
            suite => {
              this.suite = suite;
              this.formulasSelectable.addItems(this.suite.formulas);
            },
            () => {
              this.toastService.info(`Could not load formula suite with ID ${params.get('suiteId')}`);
              redirect();
            }
          );
        }
      }
    );
  }

  createFormula(): void {
      const modalRef = this.modalService.open(CreateLtsFormulaModalComponent);
      modalRef.componentInstance.suite = this.suite;
      modalRef.result.then(createdFormula => {
        this.suite.formulas.push(createdFormula);
        this.formulasSelectable.addItem(createdFormula);
      }).catch(res => this.toastService.danger(`The formula could not be created. ${res.error.message}`));
  }

  editFormula(formula: any): void {
    const modalRef = this.modalService.open(EditLtsFormulaModalComponent);
    modalRef.componentInstance.formula = JSON.parse(JSON.stringify(formula));
    modalRef.componentInstance.suite = this.suite;
    modalRef.result.then(updatedFormula => {
      this.suite.formulas = replaceItem(this.suite.formulas, f => f.id === updatedFormula.id, updatedFormula);
      this.formulasSelectable.update(updatedFormula);
    }).catch(() => {
    });
  }

  moveFormulas(formulas: any[]) {
    const modalRef = this.modalService.open(MoveLtsFormulaModalComponent);
    modalRef.componentInstance.formulas = formulas;
    modalRef.componentInstance.suite = this.suite;
    modalRef.result.then(movedFormulas => {
      const ids = movedFormulas.map(f => f.id);
      this.suite.formulas = this.suite.formulas.filter(f => ids.indexOf(f.id) === -1);
      this.formulasSelectable.removeMany(movedFormulas);
    }).catch(() => {
    });
  }

  deleteFormula(formula: any): void {
    this.formulaApiService.delete(this.appStore.project.id, formula.suite, formula.id).subscribe(
      () => {
        this.suite.formulas = this.suite.formulas.filter(f => f.id !== formula.id);
        this.formulasSelectable.remove(formula);
      }
    );
  }

  deleteFormulas(formulas: any[]): void {
    this.formulaApiService.deleteMany(this.appStore.project.id, this.suite.id, formulas.map(f => f.id)).subscribe(
      () => {
        this.suite.formulas = removeItems(this.suite.formulas, f => formulas.indexOf(f) > -1);
        this.formulasSelectable.removeMany(formulas);
      }
    );
  }

  get project(): Project {
    return this.appStore.project;
  }
}
