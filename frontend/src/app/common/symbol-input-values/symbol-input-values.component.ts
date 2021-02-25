/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { ParametrizedSymbol, SymbolOutputMapping } from '../../entities/parametrized-symbol';

@Component({
  selector: 'symbol-input-values',
  templateUrl: './symbol-input-values.component.html',
  styleUrls: ['./symbol-input-values.component.scss']
})
export class SymbolInputValuesComponent {

  @Input()
  parameterizedSymbol: ParametrizedSymbol;

  handleOutputBlur(mapping: SymbolOutputMapping, value: string): void {
    if (value === '') {
      mapping.name = mapping.parameter.name;
    }
  }
}
