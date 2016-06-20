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
 * The directive that loads an action template by its type. E.g. type: 'web_click' -> load 'web_click.html'
 *
 * Attribute 'action' should contain the action object
 * Attribute 'symbols' should contain the list of symbols so that they are available by the action
 *
 * Use: <action-create-edit-form action="..." symbols="..."></action-create-edit-form>
 * @returns {{scope: {action: string}, template: string}}
 */
class ActionCreateEditForm {

    /** Constructor **/
    constructor() {

        /**
         * The map where actions can store temporary values
         */
        this.map = {};

        /**
         * If the advanced options are visible
         * @type {boolean}
         */
        this.showOptions = false;
    }

    /**
     * Returns the corresponding html template for each action based on its type
     * @returns {*}
     */
    getTemplate() {
        return `html/actions/${this.action.type}.html`;
    }
}

export const actionCreateEditForm = {
    bindings: {
        action: '=',
        symbols: '='
    },
    controller: ActionCreateEditForm,
    controllerAs: 'vm',
    template: `
        <div ng-if="vm.action !== null">
            <div ng-include="vm.getTemplate()"></div>
            <hr>
            <p>
                <a href="" ng-click="vm.showOptions = !vm.showOptions">
                    <i class="fa fa-gear fa-fw"></i> Advanced Options
                </a>
            </p>
            <div uib-collapse="!vm.showOptions">
                <div class="checkbox">
                    <label>
                        <input type="checkbox" ng-model="vm.action.negated"> Negate
                    </label>
                </div>
                <div class="checkbox">
                    <label>
                        <input type="checkbox" ng-model="vm.action.ignoreFailure"> Ignore Failure
                    </label>
                </div>
            </div>
        </div>
    `
};