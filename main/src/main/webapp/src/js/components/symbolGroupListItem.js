/*
 * Copyright 2016 TU Dortmund
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
 * The component that displays a single symbol group.
 *
 * Use: <symbol-group-list-item group="..." editable="..."></symbol-group-list-item>.
 *
 * Set attribute 'editable' to 'true' so that an icon to edit the group is displayed. Omit it
 * otherwise.
 */
class SymbolGroupListItem {

    /**
     * Constructor.
     *
     * @param $attrs
     */
    // @ngInject
    constructor($attrs) {

        /**
         * If the option to edit the group should be displayed.
         * @type {boolean}
         */
        this.editable = $attrs.editable === 'true';
    }
}

export const symbolGroupListItem = {
    templateUrl: 'html/components/symbol-group-list-item.html',
    transclude: true,
    controller: SymbolGroupListItem,
    controllerAs: 'vm',
    bindings: {
        group: '='
    }
};