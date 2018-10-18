/*
 * Copyright 2018 TU Dortmund
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

import {ToastService} from '../../../../services/toast.service';
import {IFormController} from 'angular';
import {HypothesisEqOracle} from '../../../../entities/eq-oracles/hypothesis-eq-oracle';

export const hypothesisEqOracleFormComponent = {
  template: require('./hypothesis-eq-oracle-form.component.html'),
  bindings: {
    form: '=',
    eqOracle: '='
  },
  controllerAs: 'vm',
  controller: class HypothesisEqOracleFormComponent {

    public form: IFormController;

    public eqOracle: HypothesisEqOracle;

    /**
     * Constructor.
     *
     * @param toastService
     */
    // @ngInject
    constructor(private toastService: ToastService) {
    }

    /**
     * Load a hypothesis from a JSON file.
     *
     * @param data A hypothesis as JSON.
     */
    fileLoaded(data: any): void {
      try {
        this.eqOracle.hypothesis = JSON.parse(data);
      } catch (e) {
        this.toastService.danger('Could not load model. The file is not properly formatted');
      }
    }
  }
};
