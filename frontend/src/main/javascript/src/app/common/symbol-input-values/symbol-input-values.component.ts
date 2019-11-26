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
import { ParametrizedSymbol, SymbolOutputMapping } from '../../entities/parametrized-symbol';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'symbol-input-values',
  templateUrl: './symbol-input-values.component.html',
  styleUrls: ['./symbol-input-values.component.scss']
})
export class SymbolInputValuesComponent {

  @Input()
  parameterizedSymbol: ParametrizedSymbol;

  addOutputMappingForm = new FormGroup({
    selectedOutput: new FormControl(''),
    mapping: new FormControl('')
  });

  addOutputMapping(): void {
    const name = this.addOutputMappingForm.controls.selectedOutput.value;
    const parameter = this.parameterizedSymbol.symbol.outputs.find(o => o.name === name);

    const mapping: SymbolOutputMapping = {
      name: this.addOutputMappingForm.controls.mapping.value,
      parameter: parameter
    };

    this.parameterizedSymbol.outputMappings.push(mapping);
  }

  get unmappedOutputs(): any[] {
    const names = this.parameterizedSymbol.outputMappings.map(m => m.parameter.name);
    return this.parameterizedSymbol.symbol.outputs.filter(o => !names.includes(o));
  }
}
