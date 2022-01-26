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
import { LearnerSetup } from '../../entities/learner-setup';
import { SymbolGroup } from '../../entities/symbol-group';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { SymbolGroupUtils } from '../../utils/symbol-group-utils';

@Component({
  selector: 'learner-setup-table',
  templateUrl: './learner-setup-table.component.html',
  styleUrls: ['./learner-setup-table.component.scss']
})
export class LearnerSetupTableComponent {

  @Input()
  setup: LearnerSetup;

  @Input()
  groups: SymbolGroup[];

  getSymbolPath(symbol: AlphabetSymbol): string {
    return SymbolGroupUtils.getSymbolPath(this.groups, symbol);
  }
}
