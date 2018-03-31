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

import {actionType} from '../../../constants';

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

        /**
         * The actions for the selection.
         */
        this.actions = {
            web: [
                {type: actionType.WEB_CHECK_ATTRIBUTE_VALUE, text: 'Check attribute value'},
                {type: actionType.WEB_CLEAR, text: 'Clear input'},
                {type: actionType.WEB_CLICK, text: 'Click element'},
                {type: actionType.WEB_CLICK_LINK_BY_TEXT, text: 'Click link by text'},
                {type: actionType.WEB_FILL, text: 'Fill input'},
                {type: actionType.WEB_MOUSE_MOVE, text: 'Move mouse'},
                {type: actionType.WEB_PRESS_KEY, text: 'Press key'},
                {type: actionType.WEB_CHECK_TEXT, text: 'Search text'},
                {type: actionType.WEB_CHECK_NODE, text: 'Search element'},
                {type: actionType.WEB_SELECT, text: 'Select from list'},
                {type: actionType.WEB_SUBMIT, text: 'Submit form'},
                {type: actionType.WEB_SWITCH_TO, text: 'Switch to'},
                {type: actionType.WEB_SWITCH_TO_FRAME, text: 'Switch to frame'},
                {type: actionType.WAIT_FOR_NODE_ATTRIBUTE, text: 'Wait for an attribute'},
                {type: actionType.WAIT_FOR_NODE, text: 'Wait for an element'},
                {type: actionType.WAIT_FOR_TEXT, text: 'Wait for text'}
            ],
            rest: [],
            misc: [
                {type: actionType.GENERAL_SET_VARIABLE_BY_HTML, text: 'Set variable by HTML'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_NODE_ATTRIBUTE, text: 'Set variable by node attribute'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_NODE_COUNT, text: 'Set variable by node count'}
            ]
        };

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
        if (this.action.type === actionType.WEB_GO_TO && el.nodeName === 'A') {
            let href = el.getAttribute('href');
            if (href !== null && href !== '') {
                if (href.startsWith(this.project.baseUrl)) {
                    href = href.substr(this.project.baseUrl.length, href.length);
                }
                this.action.url = href;
            }
        } else if (this.action.type === actionType.WEB_CLICK_LINK_BY_TEXT && el.nodeName === 'A') {
            this.action.value = el.innerText;
        } else if ([actionType.WEB_CLEAR, actionType.WEB_CLICK, actionType.WEB_FILL, actionType.WEB_CHECK_NODE,
                actionType.WEB_SUBMIT, actionType.WEB_SELECT, actionType.WEB_MOUSE_MOVE, actionType.WEB_PRESS_KEY,
                actionType.WAIT_FOR_NODE, actionType.WEB_CHECK_ATTRIBUTE_VALUE, actionType.WAIT_FOR_NODE_ATTRIBUTE,
                actionType.WEB_SWITCH_TO, actionType.WEB_SWITCH_TO_FRAME, actionType.GENERAL_SET_VARIABLE_BY_HTML,
                actionType.GENERAL_SET_VARIABLE_BY_NODE_ATTRIBUTE, actionType.GENERAL_SET_VARIABLE_BY_NODE_COUNT,
                actionType.WAIT_FOR_NODE_ATTRIBUTE].indexOf(this.action.type) > -1) {
            this.action.node = {selector: this.modalData.selector, type: this.modalData.selectorType};
        } else if ([actionType.WEB_CHECK_TEXT].indexOf(this.action.type) > -1) {
            this.action.value = el.innerText;
        } else if (actionType.WAIT_FOR_TEXT === this.action.type) {
            this.action.value = el.innerText;
            this.action.node = {selector: this.modalData.selector, type: this.modalData.selectorType};
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
    template: require('./action-recorder-actions-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controller: ActionRecorderActionsModal,
    controllerAs: 'vm'
};
