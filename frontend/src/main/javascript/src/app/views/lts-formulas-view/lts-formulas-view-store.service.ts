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

import { remove } from 'lodash';
import { Injectable } from '@angular/core';
import { LtsFormulaApiService } from '../../services/api/lts-formula-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Selectable } from '../../utils/selectable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppStoreService } from '../../services/app-store.service';
import { CreateLtsFormulaModalComponent } from './create-lts-formula-modal/create-lts-formula-modal.component';
import { EditLtsFormulaModalComponent } from './edit-lts-formula-modal/edit-lts-formula-modal.component';
import { replaceItem } from '../../utils/list-utils';

@Injectable()
export class LtsFormulasViewStoreService {

  public formulasSelectable: Selectable<any, any>;
  private formulas: BehaviorSubject<any[]>;

  constructor(private ltsFormulaApi: LtsFormulaApiService,
              private modalService: NgbModal,
              private appStore: AppStoreService) {
    this.formulas = new BehaviorSubject<any[]>([]);
    this.formulasSelectable = new Selectable<any, any>([], f => f.id);
  }

  get formulas$(): Observable<any> {
    return this.formulas.asObservable();
  }

  load(): void {
    this.ltsFormulaApi.getAll(this.appStore.project.id).subscribe(
      formulas => {
        this.formulas.next(formulas);
        this.formulasSelectable.addItems(formulas);
      }
    )
  }

  create(): void {
    const modalRef = this.modalService.open(CreateLtsFormulaModalComponent);
    modalRef.result.then(f => {
      this.formulas.next([...this.formulas.value, f]);
      this.formulasSelectable.addItem(f);
    }).catch(() => {
    });
  }

  edit(formula: any): void {
    const modalRef = this.modalService.open(EditLtsFormulaModalComponent);
    modalRef.componentInstance.formula = JSON.parse(JSON.stringify(formula));
    modalRef.result.then(updatedFormula => {
      const fs = replaceItem(this.formulas.value, f => f.id === updatedFormula.id, updatedFormula);
      this.formulas.next(fs);
      this.formulasSelectable.update(updatedFormula);
    }).catch(() => {
    });
  }

  delete(formula: any): void {
    this.ltsFormulaApi.delete(this.appStore.project.id, formula.id).subscribe(
      () => {
        const fs = [...this.formulas.value];
        remove(fs, f => f.id === formula.id);
        this.formulas.next(fs);
        this.formulasSelectable.unselect(formula);
      }
    );
  }

  deleteSelected(): void {
    const formulas = this.formulasSelectable.getSelected();
    if (formulas.length > 0) {
      const ids = formulas.map(f => f.id);
      this.ltsFormulaApi.deleteMany(this.appStore.project.id, ids).subscribe(() => {
        const fs = [...this.formulas.value].filter(f => ids.indexOf(f.id) === -1);
        this.formulas.next(fs);
        this.formulasSelectable.unselectMany(formulas);
      });
    }
  }
}
