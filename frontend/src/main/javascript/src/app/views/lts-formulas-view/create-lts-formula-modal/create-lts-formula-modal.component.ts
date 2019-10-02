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

import { Component } from '@angular/core';
import { LtsFormulaApiService } from '../../../services/resources/lts-formula-api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppStoreService } from '../../../services/app-store.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'create-lts-formula-modal',
  templateUrl: './create-lts-formula-modal.component.html'
})
export class CreateLtsFormulaModalComponent {

  public formula: any;
  public errorMessage: string;
  public createForm: FormGroup;

  constructor(private ltsFormulaApi: LtsFormulaApiService,
              private modal: NgbActiveModal,
              private appStore: AppStoreService) {
    this.formula = {
      name: '',
      formula: ''
    };
    this.createForm = new FormGroup({});
  }

  createFormula(): void {
    this.errorMessage = null;

    console.log(this.createForm);

    this.ltsFormulaApi.create(this.appStore.project.id, this.formula).subscribe(
      createdFormula => {
        this.modal.close(createdFormula);
      }, err => this.errorMessage = err.data.message
    );
  }
}
