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

export const symbolSelectModalComponent = {
    template: require('./symbol-select-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controllerAs: 'vm',
    controller: class SymbolSelectModalComponent {

        /** Constructor. */
        constructor() {
            this.selectedSymbol = null;
            this.groups = [];
        }

        $onInit() {
            this.groups = this.resolve.groups;
        }

        selectSymbol(symbol) {
            this.selectedSymbol = symbol;
        }

        ok() {
            if (this.selectedSymbol == null) {
                this.dismiss();
            } else {
                this.close({$value: this.selectedSymbol});
            }
        }
    }
};
