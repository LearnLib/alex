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

import { Component, Input } from '@angular/core';
import { LtsFormulaApiService } from '../../../services/api/lts-formula-api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppStoreService } from '../../../services/app-store.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-lts-formula-modal',
  templateUrl: './edit-lts-formula-modal.component.html'
})
export class EditLtsFormulaModalComponent {

  @Input()
  public formula: any;

  public errorMessage: string;
  public editForm: FormGroup;

  constructor(public modal: NgbActiveModal,
              private ltsFormulaApi: LtsFormulaApiService,
              private appStore: AppStoreService) {
    this.editForm = new FormGroup({});
  }

  updateFormula(): void {
    this.errorMessage = null;
    if (this.editForm.valid) {
      const values = this.editForm.value;

      this.formula.name = values.name;
      this.formula.formula = values.formula;

      this.ltsFormulaApi.update(this.appStore.project.id, this.formula).subscribe(
        updatedFormula => {
          this.modal.close(updatedFormula);
        },
        res => this.errorMessage = res.error.message
      );
    }
  }
}
