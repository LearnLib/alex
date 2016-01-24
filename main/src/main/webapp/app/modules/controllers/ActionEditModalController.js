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

import {events} from '../constants';

/** The controller for the modal dialog that handles the editing of an action. */
// @ngInject
class ActionEditModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param ActionService
     * @param SymbolResource
     * @param SessionService
     * @param EventBus
     */
    constructor($modalInstance, modalData, ActionService, SymbolResource, SessionService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.ActionService = ActionService;
        this.EventBus = EventBus;

        // the project in the session
        const project = SessionService.getProject();

        /**
         * The copy of the action that should be edited
         * @type {Object}
         */
        this.action = modalData.action;

        /**
         * The list of symbols
         * @type {Array}
         */
        this.symbols = [];

        // fetch all symbols so that symbols have access to it
        SymbolResource.getAll(project.id).then(symbols => {
            this.symbols = symbols;
        });
    }

    /** Close the modal dialog and pass the updated action to the handle that called it */
    updateAction() {
        this.EventBus.emit(events.ACTION_UPDATED, {action: this.action});
        this.$modalInstance.dismiss();
    }

    /** Close the modal dialog without passing any data */
    closeModal() {
        this.$modalInstance.dismiss();
    }
}

export default ActionEditModalController;