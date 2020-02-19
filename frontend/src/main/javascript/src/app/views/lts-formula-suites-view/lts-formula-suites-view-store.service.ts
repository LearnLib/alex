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

import { remove } from 'lodash';
import { Injectable } from '@angular/core';
import { LtsFormulaApiService } from '../../services/api/lts-formula-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Selectable } from '../../utils/selectable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppStoreService } from '../../services/app-store.service';
import { replaceItem } from '../../utils/list-utils';
import { LtsFormulaSuiteApiService } from '../../services/api/lts-formula-suite-api.service';
import { PromptService } from '../../services/prompt.service';
import { ToastService } from '../../services/toast.service';

@Injectable()
export class LtsFormulaSuitesViewStoreService {

  public formulasSelectable: Selectable<any, any>;
  private formulas: BehaviorSubject<any[]>;

  constructor(private ltsFormulaApi: LtsFormulaApiService,
              private ltsFormulaSuiteApi: LtsFormulaSuiteApiService,
              private modalService: NgbModal,
              private promptService: PromptService,
              private toastService: ToastService,
              private appStore: AppStoreService) {
    this.formulas = new BehaviorSubject<any[]>([]);
    this.formulasSelectable = new Selectable<any, any>(f => f.id);
  }

  get formulas$(): Observable<any> {
    return this.formulas.asObservable();
  }

  load(): void {
    this.ltsFormulaSuiteApi.getAll(this.appStore.project.id).subscribe(
      suites => {
        this.formulas.next(suites);
        this.formulasSelectable.addItems(suites);
      }
    )
  }

  createSuite(): void {
    this.promptService.prompt('Enter a name for the formula suite')
      .then(name => {
        this.ltsFormulaSuiteApi.create(this.appStore.project.id, {name}).subscribe(
          suite => {
            this.formulas.next([...this.formulas.value, suite]);
            this.formulasSelectable.addItem(suite);
          },
          res => this.toastService.danger(`Failed to create formula suite. ${res.error.message}`))
      });
  }

  editSuite(suite: any): void {
    this.promptService.prompt('Update the name for the formula suite.', {defaultValue: suite.name})
      .then(name => {
        if (name !== suite.name) {
          this.ltsFormulaSuiteApi.update(this.appStore.project.id, suite.id, {name}).subscribe(
            s => {
              const fs = replaceItem(this.formulas.value, f => f.id === s.id, s);
              this.formulas.next(fs);
              this.formulasSelectable.update(s);
            },
            res => this.toastService.danger(`Failed to update formula suite. ${res.error.message}`)
          );
        }
      })
  }

  deleteSuite(suite: any): void {
    this.ltsFormulaSuiteApi.remove(this.appStore.project.id, suite.id).subscribe(
      () => {
        const fs = [...this.formulas.value];
        remove(fs, f => f.id === suite.id);
        this.formulas.next(fs);
        this.formulasSelectable.remove(suite);
      }
    );
  }

  deleteSelected(): void {
    const formulas = this.formulasSelectable.getSelected();
    if (formulas.length > 0) {
      const ids = formulas.map(f => f.id);
      this.ltsFormulaSuiteApi.removeAll(this.appStore.project.id, ids).subscribe(() => {
        const fs = [...this.formulas.value].filter(f => ids.indexOf(f.id) === -1);
        this.formulas.next(fs);
        this.formulasSelectable.removeMany(formulas);
      });
    }
  }
}
