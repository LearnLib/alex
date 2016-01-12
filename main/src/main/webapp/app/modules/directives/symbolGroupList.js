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

function symbolGroupList() {
    return {
        transclude: true,
        template: `
            <div class="symbol-group-list" ng-transclude></div>
        `
    };
}

function symbolGroupListItem() {
    return {
        transclude: true,
        scope: {
            group: '='
        },
        template: `
                <div class="symbol-group-list-item" ng-class="{'collapsed':group._collapsed}">
                    <div class="symbol-group-list-item-header">
                        <div class="flex-item">
                            <checkbox-multiple model="group.symbols"></checkbox-multiple>
                        </div>
                        <div class="flex-item">
                            <h3 class="symbol-group-title" ng-bind="group.name"></h3><br>
                            <span class="text-muted">
                                <span ng-bind="group.symbols.length"></span> Symbols
                            </span>
                        </div>
                        <div class="flex-item" ng-if="editable">
                            <a href="" symbol-group-edit-modal-handle group="group"
                               tooltip="Edit this group" tooltip-placement="left">
                                 <i class="fa fa-fw fa-gear"></i>
                            </a>
                        </div>
                    </div>
                    <div class="symbol-group-list-item-body" ng-transclude></div>
                </div>
            `,
        link: function (scope, el, attrs) {
            scope.editable = attrs.editable === 'true';
        }
    };
}

export {symbolGroupList, symbolGroupListItem};