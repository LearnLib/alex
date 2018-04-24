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

/**
 * Recursive component that displays a single item in the symbol group tree.
 */
export const simpleSymbolGroupTreeItemComponent = {
    template: require('./simple-symbol-group-tree-item.component.html'),
    bindings: {
        group: '<',
        selectedSymbol: '=',
        selectedSymbolGroup: '=',
        onSymbolGroupSelected: '&',
        onSymbolSelected: '&',
    },
    controllerAs: 'vm',
    controller: class {

        /** Constructor. */
        constructor() {

            /**
             * If the symbol group is collapsed.
             * @type {boolean}
             */
            this.collapse = true;
        }

        /** Fired when a symbol group is clicked on. */
        selectSymbolGroup() {
            this.symbolGroupSelected(this.group);
        }

        /**
         * Fired when a symbol is clicked on.
         *
         * @param {AlphabetSymbol} symbol The symbol that is clicked on.
         */
        selectSymbol(symbol) {
            this.symbolSelected(symbol);
        }

        /**
         * Wrapper for the 'onSymbolGroupSelected' component attribute that is passed to child components.
         *
         * @param {SymbolGroup} group The selected group that is emitted.
         */
        symbolGroupSelected(group) {
            this.onSymbolGroupSelected({group});
        }

        /**
         * Wrapper for the 'onSymbolSelected' component attribute that is passed to child components.
         *
         * @param {AlphabetSymbol} symbol The selected symbol that is emitted.
         */
        symbolSelected(symbol) {
            this.onSymbolSelected({symbol});
        }
    }
};
