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
 * Use: <symbol-group-list-item group="..." editable="..."></symbol-group-list-item>
 *
 * Set attribute 'editable' to 'true' so that an icon to edit the group is displayed. Omit it
 * otherwise.
 */
// @ngInject
class SymbolGroupListItem {

    /**
     * Constructor
     * @param $attrs
     */
    constructor($attrs) {

        /**
         * If the option to edit the group should be displayed
         * @type {boolean}
         */
        this.editable = $attrs.editable === 'true';
    }
}

const symbolGroupListItem = {
    template: `
        <div class="symbol-group-list-item">
            <div class="symbol-group-list-item-header">
                <div class="flex-item">
                    <checkbox-multiple model="vm.group.symbols"></checkbox-multiple>
                </div>
                <div class="flex-item">
                    <h3 class="symbol-group-title" ng-bind="vm.group.name"></h3><br>
                    <span class="text-muted">
                        <span ng-bind="vm.group.symbols.length"></span> Symbols
                    </span>
                </div>
                <div class="flex-item" ng-if="editable">
                    <a href="" symbol-group-edit-modal-handle group="vm.group"
                       uib-tooltip="Edit this group" tooltip-placement="left">
                         <i class="fa fa-fw fa-gear"></i>
                    </a>
                </div>
            </div>
            <div class="symbol-group-list-item-body" ng-transclude></div>
        </div>
    `,
    transclude: true,
    controller: SymbolGroupListItem,
    controllerAs: 'vm',
    bindings: {
        group: '='
    }
};

export {symbolGroupListItem};