/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LtsFormulaApiService } from '../../../services/api/lts-formula-api.service';
import { LtsFormulaSuiteApiService } from '../../../services/api/lts-formula-suite-api.service';
import { AppStoreService } from '../../../services/app-store.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'move-lts-formula-modal',
  templateUrl: './move-lts-formula-modal.component.html'
})
export class MoveLtsFormulaModalComponent implements OnInit {

  @Input()
  suite: any;

  @Input()
  formulas: any[] = [];

  suites: any[] = [];
  selectedSuite: any;
  errorMessage: string;

  constructor(public modal: NgbActiveModal,
              private ltsFormulaApi: LtsFormulaApiService,
              private ltsFormulaSuiteApiService: LtsFormulaSuiteApiService,
              private toastService: ToastService,
              private appStore: AppStoreService) {
  }

  moveFormulas(): void {
    this.errorMessage = null;

    if (this.selectedSuite.id === this.suite.id) {
      this.modal.close([]);
    } else {
      this.ltsFormulaApi.updateSuite(this.appStore.project.id, this.suite.id, this.formulas, this.selectedSuite).subscribe(
        movedFormulas => {
          this.toastService.success(`Moved formulas to suite "${this.selectedSuite.name}"`);
          this.modal.close(movedFormulas);
        },
        res => this.errorMessage = res.error.message
      );
    }
  }

  ngOnInit(): void {
    this.selectedSuite = this.suite;
    this.ltsFormulaSuiteApiService.getAll(this.appStore.project.id).subscribe(
      suites => this.suites = suites
    );
  }

  getFolderText(suite: any): string {
    return suite.name;
  }

  getFileText(formula: any): string {
    return formula.name;
  }
}
