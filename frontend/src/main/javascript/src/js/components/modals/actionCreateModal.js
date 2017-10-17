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

import {events} from "../../constants";

/**
 * The controller for the modal dialog that handles the creation of a new action.
 */
export class ActionCreateModalComponent {

    /**
     * Constructor.
     *
     * @param {ActionService} ActionService
     * @param {SymbolResource} SymbolResource
     * @param {SessionService} SessionService
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor(ActionService, SymbolResource, SessionService, EventBus) {
        this.ActionService = ActionService;
        this.EventBus = EventBus;

        const project = SessionService.getProject();

        /**
         * The model for the new action.
         * @type {null|Object}
         */
        this.action = null;

        /**
         * All symbols of the project.
         * @type {AlphabetSymbol[]}
         */
        this.symbols = [];

        // get all symbols
        SymbolResource.getAll(project.id).then(symbols => {
            this.symbols = symbols;
        });
    }

    /**
     * Creates a new instance of an Action by a type that was clicked in the modal dialog.
     * @param {string} type - The type of the action that should be created.
     */
    selectNewActionType(type) {
        this.action = this.ActionService.createFromType(type);
    }

    /**
     * Closes the modal dialog an passes the created action back to the handle that called the modal.
     */
    createAction() {
        this.EventBus.emit(events.ACTION_CREATED, {action: this.action});
        this.dismiss();
    }

    /**
     * Creates a new action in the background without closing the dialog.
     */
    createActionAndContinue() {
        this.EventBus.emit(events.ACTION_CREATED, {action: this.action});
        this.action = null;
    }
}


export const actionCreateModalComponent = {
    templateUrl: 'html/components/modals/action-create-modal.html',
    bindings: {
        dismiss: '&'
    },
    controller: ActionCreateModalComponent,
    controllerAs: 'vm'
};


/**
 * The directive that is used to handle the modal dialog for creating an action. Must be used as an attribute for
 * the attached element. It attaches a click event to the element that opens the modal dialog. Does NOT saves the
 * action on the server.
 *
 * Can be used like this: '<button action-create-modal-handle>Click Me!</button>'.
 *
 * @param $uibModal - The modal service.
 * @returns {{restrict: string, scope: {}, link: Function}}
 */
// @ngInject
export function actionCreateModalHandle($uibModal) {
    return {
        restrict: 'A',
        scope: {},
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'actionCreateModal',
                    size: 'lg',
                });
            });
        }
    };
}