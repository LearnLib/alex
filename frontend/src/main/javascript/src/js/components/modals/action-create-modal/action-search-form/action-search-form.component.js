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

export const actionSearchFormComponent = {
    template: require('./action-search-form.component.html'),
    bindings: {
        actions: '<',
        onSelected: '&'
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Select an action.
         * @param action The action.
         */
        selectAction(action) {
            this.onSelected({type: action.type});
        }

        /**
         * Get all actions from the action list.
         * @return {*} The actions.
         */
        getActions() {
            return this.actions.web.concat(this.actions.rest).concat(this.actions.misc);
        }

        /**
         * Select if an action should be displayed in the result list.
         * @param action The action.
         * @param value The user input.
         * @return {boolean}
         */
        filterAction(action, value) {
            return action.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
                || action.type.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        }

        /**
         * What should be displayed in the list.
         * @param action The action.
         * @return {*}
         */
        displayAction(action) {
            return action.text;
        }
    }
};
