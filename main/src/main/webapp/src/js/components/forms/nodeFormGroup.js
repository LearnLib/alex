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

export const nodeFormGroup = {
    template: `
        <div class="row">
            <div class="col-xs-9">
                <div class="form-group">
                    <label class="control-label">Selector</label>
                    <input class="form-control" type="text" placeholder="CSS selector" ng-model="vm.node.selector">
                </div>
            </div>
            <div class="col-xs-3 no-padding-left">
                <div class="form-group">
                    <label class="control-label">&nbsp;</label>
                    <select class="form-control" ng-options="m for m in ['CSS', 'XPATH']" ng-model="vm.node.type">
                        <option value="" disabled>Select a type</option>
                    </select>
                </div>
            </div>
            <div class="col-xs-12">
                <div class="form-group">
                    <a class="btn btn-default btn-sm" html-element-picker-handle model="vm.node.selector">
                        <i class="fa fa-magic fa-fw"></i>&nbsp; Element Picker
                    </a>
                </div>
            </div>
        </div>
    `,
    bindings: {
        node: '='
    },
    controllerAs: 'vm',
};