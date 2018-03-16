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

export const symbolParameterEditModalComponent = {
    template: require('./symbol-parameter-edit-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controller: class {

        /** Constructor. */
        constructor() {

            /**
             * The error message to display.
             * @type {string|null}
             */
            this.errorMessage = null;

            /**
             * The form.
             * @type {object}
             */
            this.form = null;

            /**
             * The model for the new parameter.
             * @type {{type: string, name: string, parameterType: string}}
             */
            this.parameter = null;
        }

        $onInit() {
            this.parameter = this.resolve.parameter;
        }

        update() {
            this.errorMessage = null;

            const symbol = this.resolve.symbol;
            if (this.parameter.type === 'input') {
                const input = symbol.inputs.find(input =>
                    input.name === this.parameter.name &&
                    input.parameterType === this.parameter.parameterType);

                if (input != null) {
                    this.errorMessage = 'There is already an input with that type and name.';
                    return;
                }
            } else {
                const output = symbol.outputs.find(out =>
                    out.name === this.parameter.name &&
                    out.parameterType === this.parameter.parameterType);

                if (output != null) {
                    this.errorMessage = 'There is already an output with that type and name.';
                    return;
                }
            }

            this.close({$value: this.parameter});
        }
    },
    controllerAs: 'vm'
};
