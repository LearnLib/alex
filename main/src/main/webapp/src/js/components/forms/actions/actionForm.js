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
 * The component that displays the action forms.
 *
 * Attribute 'action' should contain the action object.
 * Attribute 'symbols' should contain the list of symbols so that they are available by the action.
 */
class ActionForm {

    /** 
     * Constructor.
     */
    constructor() {

        /**
         * If the advanced options are visible.
         * 
         * @type {boolean}
         */
        this.showOptions = false;
    }
}

export const actionForm = {
    bindings: {
        action: '=',
        symbols: '='
    },
    controller: ActionForm,
    controllerAs: 'vm',
    templateUrl: 'html/components/forms/actions/action-form.html'
};