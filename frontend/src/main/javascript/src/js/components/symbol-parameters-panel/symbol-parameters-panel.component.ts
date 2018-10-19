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

import {AlphabetSymbol} from '../../entities/alphabet-symbol';
import {PromptService} from '../../services/prompt.service';
import {SymbolParameterResource} from '../../services/resources/symbol-parameter-resource.service';
import {ToastService} from '../../services/toast.service';

export const symbolParametersPanelComponent = {
  template: require('./symbol-parameters-panel.component.html'),
  bindings: {
    symbol: '=',
    onChange: '&'
  },
  controllerAs: 'vm',
  controller: class SymbolParametersPanelComponent {

    public symbol: AlphabetSymbol;

    public onChange: (any?) => void;

    /**
     * Constructor.
     *
     * @param promptService
     * @param symbolParameterResource
     * @param toastService
     * @param $uibModal
     */
    /* @ngInject */
    constructor(private promptService: PromptService,
                private symbolParameterResource: SymbolParameterResource,
                private toastService: ToastService,
                private $uibModal: any) {
    }

    addInput(): void {
      this.$uibModal.open({
        component: 'symbolParameterCreateModal',
        resolve: {
          symbol: () => this.symbol,
          type: () => 'input'
        }
      }).result.then((param) => {
        this.symbol.inputs.push(param);
        this.onChange();
      });
    }

    addOutput(): void {
      this.$uibModal.open({
        component: 'symbolParameterCreateModal',
        resolve: {
          symbol: () => this.symbol,
          type: () => 'output'
        }
      }).result.then((param) => {
        this.symbol.outputs.push(param);
        this.onChange();
      });
    }

    editInput(input: any, index: number): void {
      this.$uibModal.open({
        component: 'symbolParameterEditModal',
        resolve: {
          symbol: () => this.symbol,
          parameter: () => Object.assign({}, input)
        }
      }).result.then((param) => {
        this.symbol.inputs[index] = param;
      });
    }

    editOutput(output: any, index: number): void {
      this.$uibModal.open({
        component: 'symbolParameterEditModal',
        resolve: {
          symbol: () => this.symbol,
          parameter: () => Object.assign({}, output)
        }
      }).result.then((param) => {
        this.symbol.outputs[index] = param;
      });
    }

    removeInput(index: number): void {
      const param = this.symbol.inputs[index];
      this.symbolParameterResource.remove(this.symbol.project, this.symbol.id, param.id)
        .then(() => this.symbol.inputs.splice(index, 1))
        .catch(err => this.toastService.danger(`The input parameter could not be deleted. ${err.data.message}`));
    }

    removeOutput(index: number): void {
      const param = this.symbol.outputs[index];
      this.symbolParameterResource.remove(this.symbol.project, this.symbol.id, param.id)
        .then(() => this.symbol.outputs.splice(index, 1))
        .catch(err => this.toastService.danger(`The output parameter could not be deleted. ${err.data.message}`));
    }
  }
};
