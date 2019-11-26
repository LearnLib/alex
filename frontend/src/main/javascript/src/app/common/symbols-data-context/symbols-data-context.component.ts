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
import { ParametrizedSymbol } from '../../entities/parametrized-symbol';

@Component({
  selector: 'symbols-data-context',
  templateUrl: './symbols-data-context.component.html',
  styleUrls: ['./symbols-data-context.component.scss']
})
export class SymbolsDataContextComponent {

  @Input()
  parametrizedSymbols: ParametrizedSymbol[] = [];

  get dataContext(): string[] {
    const variables: string[] = [];

    this.parametrizedSymbols.forEach(ps => {
      ps.outputMappings.forEach(om => {
         if (!variables.includes(om.name)) {
           variables.push(om.name);
         }
      });
    });

    return variables;
  }
}
