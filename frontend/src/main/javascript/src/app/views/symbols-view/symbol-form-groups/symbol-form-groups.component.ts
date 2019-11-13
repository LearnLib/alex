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

import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { FormUtilsService } from '../../../services/form-utils.service';

@Component({
  selector: 'symbol-form-groups',
  templateUrl: './symbol-form-groups.component.html'
})
export class SymbolFormGroupsComponent implements OnInit {

  @Input()
  symbol: AlphabetSymbol;

  @Input()
  form: FormGroup;

  constructor(public formUtils: FormUtilsService) {
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(this.symbol.name, [
      Validators.required, Validators.maxLength(100)
    ]));
    this.form.addControl('description', new FormControl(this.symbol.description, [
      Validators.maxLength(1024)
    ]));
    this.form.addControl('expectedResult', new FormControl(this.symbol.expectedResult, [
      Validators.maxLength(1024)
    ]));
  }
}
