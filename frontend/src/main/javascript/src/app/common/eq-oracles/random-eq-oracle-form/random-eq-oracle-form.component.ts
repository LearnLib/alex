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
import { FormGroup } from '@angular/forms';
import { RandomEqOracle } from '../../../entities/eq-oracles/random-eq-oracle';

@Component({
  selector: 'random-eq-oracle-form',
  templateUrl: './random-eq-oracle-form.component.html'
})
export class RandomEqOracleFormComponent {

  @Input()
  form: FormGroup;

  @Input('oracle')
  eqOracle: RandomEqOracle;
}

