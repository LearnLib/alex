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

export const symbolParametersPanelComponent = {
    template: require('./symbol-parameters-panel.component.html'),
    bindings: {
        symbol: '=',
        onChange: '&'
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         * @param {PromptService} PromptService
         * @param {SymbolParameterResource} SymbolParameterResource
         * @param {ToastService} ToastService
         * @param {$uibModal} $uibModal
         */
        // @ngInject
        constructor(PromptService, SymbolParameterResource, ToastService, $uibModal) {
            this.promptService = PromptService;
            this.symbolParameterResource = SymbolParameterResource;
            this.toastService = ToastService;
            this.$uibModal = $uibModal;
        }

        addInput() {
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

        addOutput() {
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

        editInput(input, index) {
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

        editOutput(output, index) {
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

        removeInput(index) {
            const param = this.symbol.inputs[index];
            this.symbolParameterResource.remove(this.symbol.project, this.symbol.id, param.id)
                .then(() => this.symbol.inputs.splice(index, 1))
                .catch(err => this.toastService.danger(`The input parameter could not be deleted. ${err.data.message}`));
        }

        removeOutput(index) {
            const param = this.symbol.outputs[index];
            this.symbolParameterResource.remove(this.symbol.project, this.symbol.id, param.id)
                .then(() => this.symbol.outputs.splice(index, 1))
                .catch(err => this.toastService.danger(`The output parameter could not be deleted. ${err.data.message}`));
        }
    }
};
