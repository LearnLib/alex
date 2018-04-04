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

import flatten from 'lodash/flatten';

export const symbolSearchFormComponent = {
    template: require('./symbol-search-form.component.html'),
    bindings: {
        groups: '<',
        onSelected: '&'
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Select a symbol.
         * @param symbol The symbol.
         */
        selectSymbol(symbol) {
            this.onSelected({symbol});
        }

        /**
         * Get all actions from the action list.
         * @return {*} The actions.
         */
        getSymbols() {
            return flatten(this.groups.map(g => g.symbols));
        }

        /**
         * Select if a symbol should be displayed in the result list.
         * @param symbol The symbol.
         * @param value The user input.
         * @return {boolean}
         */
        filterSymbol(symbol, value) {
            return symbol.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        }

        /**
         * What should be displayed in the list.
         * @param symbol The symbol.
         * @return {*}
         */
        displaySymbol(symbol) {
            return symbol.name;
        }
    }
};
