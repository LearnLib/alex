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

import { Component, Input, OnInit } from '@angular/core';
import { SymbolParameterApiService } from '../../../../services/api/symbol-parameter-api.service';
import { symbolParameterType } from '../../../../constants';
import { AlphabetSymbol } from '../../../../entities/alphabet-symbol';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'create-symbol-parameter-modal',
  templateUrl: './create-symbol-parameter-modal.component.html'
})
export class CreateSymbolParameterModalComponent implements OnInit {

  @Input()
  symbol: AlphabetSymbol;

  @Input()
  type: string;

  /** The error message. */
  errorMessage: string;

  /** The model for the new parameter. */
  parameter: any;

  form: FormGroup;

  constructor(public modal: NgbActiveModal,
              private symbolParameterApi: SymbolParameterApiService) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.parameter = {
      type: this.type,
      name: null,
      parameterType: symbolParameterType.STRING
    };
  }

  addParameter(): void {
    this.errorMessage = null;

    const values = this.form.value;

    this.parameter.name = values.name;
    this.parameter.parameterType = values.parameterType;

    this.symbolParameterApi.create(this.symbol.project, this.symbol.id, this.parameter).subscribe(
      param => this.modal.close(param),
      res => {
        this.errorMessage = res.error.message
      }
    );
  }
}
