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
 * The form that searches for an action based on user input.
 * @type {{templateUrl: string, bindings: {actions: string, onSelected: string}, controllerAs: string, controller: actionSearchForm.controller}}
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
         * Constructor.
         *
         * @param $scope
         * @param $element
         */
        // @ngInject
        constructor($element, $scope) {
            this.$element = $element;
            this.$scope = $scope;

            /**
             * If the input element has been focused.
             * @type {boolean}
             */
            this.focused = false;

            /**
             * The list of actions that are displayed based on the user input.
             * @type {Array}
             */
            this.actionList = [];

            /**
             * The user input.
             * @type {string}
             */
            this.value = '';

            this._handleClick = this._handleClick.bind(this);
        }

        /**
         * Handles to input focus event.
         */
        handleFocus() {
            this.focused = true;
            this.updateActionList();

            document.addEventListener('click', this._handleClick);
        }

        /**
         * Selects an action and hides the action list.
         *
         * @param {object} action
         */
        selectAction(action) {
            this._reset();
            this.value = '';
            this.onSelected({type: action.type});
        }

        /**
         * Filter the list of actions that is displayed based on the user input.
         * Fires every 500ms.
         */
        updateActionList() {
            const actions = this.actions.web.concat(this.actions.rest).concat(this.actions.misc);
            this.actionList = actions.filter(action => {
                return action.text.toLowerCase().indexOf(this.value.toLowerCase()) !== -1
                    || action.type.toLowerCase().indexOf(this.value.toLowerCase()) !== -1;
            });
        }

        _handleClick(e) {
            let target = e.target;
            while (target !== document.body) {
                if (target === this.$element[0]) {
                    return false;
                }
                target = target.parentNode;
            }

            document.removeEventListener('click', this._handleClick);
            this.$scope.$apply(() => this._reset());
        }

        _reset() {
            this.focused = false;
            this.actionList = [];
        }
    }
};
