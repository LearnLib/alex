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

import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ParametrizedSymbol } from '../../entities/parametrized-symbol';
import { uniqBy } from 'lodash';

interface DataContextItem {
  name: string;
  parameterType: string;
}

@Component({
  selector: 'symbols-data-context',
  templateUrl: './symbols-data-context.component.html'
})
export class SymbolsDataContextComponent implements OnChanges {

  @Input()
  parametrizedSymbols: ParametrizedSymbol[] = [];

  dataContext: DataContextItem[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.dataContext = this.createDataContext();
  }

  getCopyData(item: DataContextItem): string {
    return item.parameterType === 'STRING' ? `{{$${item.name}}}` : `{{#${item.name}}}`;
  }

  trackByFn(index, item: DataContextItem) {
    return item.name + '_' + item.parameterType;
  }

  private createDataContext(): DataContextItem[] {
    const dataContext: DataContextItem[] = [];
    this.parametrizedSymbols.forEach(ps => {
      ps.outputMappings.forEach(om => {
        if (dataContext.findIndex(v => v.name === om.name && v.parameterType === om.parameter.parameterType) === -1) {
          dataContext.push({
            name: om.name,
            parameterType: om.parameter.parameterType
          });
        }
      });
    });
    return dataContext;
  }

  get hasDuplicateParameterNames(): boolean {
    return uniqBy(this.dataContext, 'name').length < this.dataContext.length;
  }

}
