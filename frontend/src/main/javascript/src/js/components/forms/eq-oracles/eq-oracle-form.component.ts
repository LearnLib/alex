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

import {eqOracleType} from '../../../constants';
import {EqOracleService} from '../../../services/eq-oracle.service';
import {EqOracle} from '../../../entities/eq-oracles/eq-oracle';
import {IFormController} from 'angular';

export const eqOracleFormComponent = {
  template: require('./eq-oracle-form.component.html'),
  bindings: {
    eqOracle: '=',
    form: '=',
    onSelected: '&'
  },
  controllerAs: 'vm',
  controller: class EqOracleFormComponent {

    public onSelected: (any) => void;

    public form: IFormController;

    /** The eq oracle types. */
    public types: any = eqOracleType;

    /** The eq oracle. */
    public eqOracle: EqOracle = null;

    /** The selected eq oracle type. */
    public selectedType: string = null;

    /**
     * Constructor.
     *
     * @param eqOracleService
     */
    /* @ngInject */
    constructor(private eqOracleService: EqOracleService) {
    }

    $onInit(): void {
      if (this.eqOracle != null) {
        this.selectedType = this.eqOracle.type;
      }
    }

    /** Emit the eq oracle that is selected. */
    selectEqOracle(): void {
      const eqOracle = this.eqOracleService.createFromType(this.selectedType);
      this.onSelected({eqOracle});
    }
  }
};
