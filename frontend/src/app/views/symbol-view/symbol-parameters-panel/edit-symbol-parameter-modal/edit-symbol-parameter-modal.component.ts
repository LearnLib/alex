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

import { Component, Input } from '@angular/core';
import { SymbolParameterApiService } from '../../../../services/api/symbol-parameter-api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlphabetSymbol } from '../../../../entities/alphabet-symbol';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'edit-symbol-parameter-modal',
  templateUrl: './edit-symbol-parameter-modal.component.html'
})
export class EditSymbolParameterModalComponent {

  @Input()
  symbol: AlphabetSymbol;

  @Input()
  parameter: any;

  /** The error message. */
  errorMessage: string;

  form: FormGroup;

  constructor(public modal: NgbActiveModal,
              private symbolParameterApi: SymbolParameterApiService) {
    this.form = new FormGroup({});
  }

  update(): void {
    this.errorMessage = null;

    const values = this.form.value;

    this.parameter.name = values.name;
    this.parameter.parameterType = values.parameterType;

    this.symbolParameterApi.update(this.symbol.project, this.symbol.id, this.parameter).subscribe({
      next: param => this.modal.close(param),
      error: res => this.errorMessage = res.error.message
    });
  }
}
