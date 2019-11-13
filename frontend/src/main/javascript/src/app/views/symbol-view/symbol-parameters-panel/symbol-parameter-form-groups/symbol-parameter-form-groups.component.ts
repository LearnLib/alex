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

import { Component, Input, OnInit } from '@angular/core';
import { symbolParameterType } from '../../../../constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../../services/form-utils.service';

@Component({
  selector: 'symbol-parameter-form-groups',
  templateUrl: './symbol-parameter-form-groups.component.html'
})
export class SymbolParameterFormGroupsComponent implements OnInit {

  @Input()
  parameter: any;

  @Input()
  form: FormGroup;

  types: string[] = Object.values(symbolParameterType);

  constructor(public formUtils: FormUtilsService) {
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(this.parameter.name, [Validators.required]));
    this.form.addControl('parameterType', new FormControl(this.parameter.parameterType, [Validators.required]));
    this.form.addControl('private', new FormControl(this.parameter.private));
  }
}
