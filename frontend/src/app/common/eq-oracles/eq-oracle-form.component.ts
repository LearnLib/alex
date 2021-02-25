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

import { eqOracleType } from '../../constants';
import { EqOracleService } from '../../services/eq-oracle.service';
import { EqOracle } from '../../entities/eq-oracles/eq-oracle';
import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'eq-oracle-form',
  templateUrl: './eq-oracle-form.component.html'
})
export class EqOracleFormComponent implements OnInit {

  @Output()
  selected = new EventEmitter();

  @Input()
  form: FormGroup;

  @Input()
  oracle: EqOracle = null;

  /** The eq oracle types. */
  types: any = eqOracleType;

  selectedType: string = null;

  constructor(private eqOracleService: EqOracleService) {
  }

  ngOnInit(): void {
    if (this.oracle != null) {
      this.selectedType = this.oracle.type;
    }
  }

  /** Emit the eq oracle that is selected. */
  selectEqOracle(): void {
    const eqOracle = this.eqOracleService.createFromType(this.selectedType);
    this.selected.emit(eqOracle);
  }
}
