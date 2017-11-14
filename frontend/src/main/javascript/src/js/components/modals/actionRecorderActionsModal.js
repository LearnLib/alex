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

import {actionType} from "../../constants";

/**
 * The controller for the modal dialog that handles the creation of a new action for the action recorder.
 */
export class ActionRecorderActionsModal {

    /**
     * Constructor.
     *
     * @param {ActionService} ActionService
     * @param {SymbolResource} SymbolResource
     * @param {SessionService} SessionService
     */
    // @ngInject
    constructor(ActionService, SymbolResource, SessionService) {
        this.ActionService = ActionService;

        this.project = SessionService.getProject();

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
        SymbolResource.getAll(this.project.id).then(symbols => {
            this.symbols = symbols;
        });
    }

    $onInit() {
        this.modalData = this.resolve.modalData;
    }

    /**
     * Creates a new instance of an Action by a type that was clicked in the modal dialog.
     * @param {string} type - The type of the action that should be created.
     */
    selectNewActionType(type) {
        this.action = this.ActionService.createFromType(type);

        const el = this.modalData.element;
        if (this.action.type === actionType.WEB_GO_TO && el.nodeName === "A") {
            let href = el.getAttribute("href");
            if (href !== null && href !== "") {
                if (href.startsWith(this.project.baseUrl)) {
                    href = href.substr(this.project.baseUrl.length, href.length);
                }
                this.action.url = href;
            }
        } else if (this.action.type === actionType.WEB_CLICK_LINK_BY_TEXT && el.nodeName === "A") {
            this.action.value = el.innerText;
        } else if ([actionType.WEB_CLEAR, actionType.WEB_CLICK, actionType.WEB_FILL, actionType.WEB_CHECK_NODE,
                actionType.WEB_SUBMIT, actionType.WEB_SELECT, actionType.WEB_MOUSE_MOVE, actionType.WEB_PRESS_KEY,
                actionType.WAIT_FOR_NODE, actionType.WEB_CHECK_ATTRIBUTE_VALUE].indexOf(this.action.type) > -1) {
            this.action.node = {selector: this.modalData.selector, type: 'CSS'};
        } else if ([actionType.WAIT_FOR_TEXT, actionType.WEB_CHECK_TEXT].indexOf(this.action.type) > -1) {
            this.action.value = el.innerText;
        }
    }

    /**
     * Closes the modal dialog an passes the created action back to the handle that called the modal.
     */
    createAction() {
        this.close({$value: {action: this.action}});
    }

    /**
     * Creates a new action in the background without closing the dialog.
     */
    createActionAndContinue() {
        this.action = null;
    }
}


export const actionRecorderActionsModal = {
    templateUrl: 'html/components/modals/action-recorder-actions-modal.html',
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controller: ActionRecorderActionsModal,
    controllerAs: 'vm'
};