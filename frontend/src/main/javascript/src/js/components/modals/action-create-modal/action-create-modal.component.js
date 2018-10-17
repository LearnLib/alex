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
 * The controller for the modal dialog that handles the creation of a new action.
 */
export class ActionCreateModalComponent {

    /**
     * Constructor.
     *
     * @param actionService
     * @param symbolResource
     * @param projectService
     */
    // @ngInject
    constructor(actionService, symbolResource, projectService) {
        this.actionService = actionService;

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
                {type: actionType.WEB_ALERT_ACCEPT_DISMISS, text: 'Alert - Accept/Dismiss'},
                {type: actionType.WEB_ALERT_GET_TEXT, text: 'Alert - Get text'},
                {type: actionType.WEB_ALERT_SEND_KEYS, text: 'Alert - Send keys'},
                {type: actionType.WEB_BROWSER, text: 'Browser window'},
                {type: actionType.WEB_CHECK_ATTRIBUTE_VALUE, text: 'Check attribute'},
                {type: actionType.WEB_CHECK_PAGE_TITLE, text: 'Check page title'},
                {type: actionType.WEB_CHECK_NODE_SELECTED, text: 'Check element selected'},
                {type: actionType.WEB_CLEAR, text: 'Clear input'},
                {type: actionType.WEB_CLICK, text: 'Click element'},
                {type: actionType.WEB_CLICK_ELEMENT_BY_TEXT, text: 'Click element by text'},
                {type: actionType.WEB_CLICK_LINK_BY_TEXT, text: 'Click link by text'},
                {type: actionType.WEB_EXECUTE_SCRIPT, text: 'Execute JavaScript'},
                {type: actionType.WEB_FILL, text: 'Fill input'},
                {type: actionType.WEB_MOUSE_MOVE, text: 'Move mouse'},
                {type: actionType.WEB_GO_TO, text: 'Open URL'},
                {type: actionType.WEB_PRESS_KEY, text: 'Press key'},
                {type: actionType.WEB_CHECK_TEXT, text: 'Search text'},
                {type: actionType.WEB_CHECK_NODE, text: 'Search element'},
                {type: actionType.WEB_SELECT, text: 'Select from list'},
                {type: actionType.WEB_SUBMIT, text: 'Submit form'},
                {type: actionType.WEB_SWITCH_TO, text: 'Switch to'},
                {type: actionType.WEB_SWITCH_TO_FRAME, text: 'Switch to frame'},
                {type: actionType.WEB_UPLOAD_FILE, text: 'Upload file'},
                {type: actionType.WAIT_FOR_NODE_ATTRIBUTE, text: 'Wait for an attribute'},
                {type: actionType.WAIT_FOR_NODE, text: 'Wait for an element'},
                {type: actionType.WAIT_FOR_TEXT, text: 'Wait for text'},
                {type: actionType.WAIT_FOR_TITLE, text: 'Wait for page title'}
            ],
            rest: [
                {type: actionType.REST_CHECK_ATTRIBUTE_EXISTS, text: 'Check attribute'},
                {type: actionType.REST_CHECK_ATTRIBUTE_TYPE, text: 'Check attribute type'},
                {type: actionType.REST_CHECK_ATTRIBUTE_VALUE, text: 'Check attribute value'},
                {type: actionType.REST_CHECK_HEADER_FIELD, text: 'Check header field'},
                {type: actionType.REST_CHECK_STATUS, text: 'Check status'},
                {type: actionType.REST_CALL, text: 'Make request'},
                {type: actionType.REST_CHECK_FOR_TEXT, text: 'Search in body'},
                {type: actionType.REST_VALIDATE_JSON, text: 'Validate JSON'}
            ],
            misc: [
                {type: actionType.GENERAL_ASSERT_COUNTER, text: 'Assert counter'},
                {type: actionType.GENERAL_ASSERT_VARIABLE, text: 'Assert variable'},
                {type: actionType.GENERAL_INCREMENT_COUNTER, text: 'Increment counter'},
                {type: actionType.GENERAL_SET_COUNTER, text: 'Set counter'},
                {type: actionType.GENERAL_SET_VARIABLE, text: 'Set variable'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_COOKIE, text: 'Set variable by cookie'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_HTTP_RESPONSE, text: 'Set variable by HTTP response'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_HTTP_STATUS, text: 'Set variable by HTTP status'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_HTML, text: 'Set variable by HTML'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_JSON, text: 'Set variable by JSON'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_NODE_ATTRIBUTE, text: 'Set variable by node attribute'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_NODE_COUNT, text: 'Set variable by node count'},
                {type: actionType.GENERAL_SET_VARIABLE_BY_REGEX_GROUP, text: 'Set variable by regex group'},
                {type: actionType.WAIT, text: 'Wait'}
            ]
        };

        // get all symbols
        const project = projectService.store.currentProject;
        symbolResource.getAll(project.id).then(symbols => {
            this.symbols = symbols;
        });
    }

    /**
     * Creates a new instance of an Action by a type that was clicked in the modal dialog.
     * @param {string} type The action that should be created.
     */
    selectNewActionType(type) {
        this.action = this.actionService.createFromType(type);
    }

    /**
     * Closes the modal dialog an passes the created action back to the handle that called the modal.
     */
    createAction() {
        this.resolve.onCreated(this.action);
        this.dismiss();
    }

    /**
     * Creates a new action in the background without closing the dialog.
     */
    createActionAndContinue() {
        this.resolve.onCreated(this.action);
        this.action = null;
    }
}

export const actionCreateModalComponent = {
    template: require('./action-create-modal.component.html'),
    bindings: {
        resolve: '=',
        dismiss: '&'
    },
    controller: ActionCreateModalComponent,
    controllerAs: 'vm'
};
