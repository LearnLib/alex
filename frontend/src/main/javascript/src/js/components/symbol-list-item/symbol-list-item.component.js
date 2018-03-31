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
 * Use: <symbol-list-item symbol="..."></symbol-list-item>.
 */
export const symbolListItemComponent = {
    template: require('./symbol-list-item.component.html'),
    bindings: {
        selectable: '=',
        symbol: '='
    },
    controller: class {

        /** Constructor. */
        constructor() {

            /**
             * Flag that indicates if the actions should be displayed.
             * @type {boolean}
             */
            this.collapsed = false;

            /**
             * If the symbol is selectable.
             * @type {boolean}
             */
            this.selectable = true;
        }

        /**
         * Toggles the status of the collapsed action list between visible and not visible.
         */
        toggleCollapsed() {
            this.collapsed = !this.collapsed;
        }
    },
    controllerAs: 'vm',
    transclude: true
};
