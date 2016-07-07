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

import {events} from '../../constants';
import {SymbolGroup} from '../../entities/SymbolGroup';

/** The controller for the modal dialog that handles the creation of a new symbol group. */
export class SymbolGroupCreateModalController {

    /**
     * Constructor
     * @param $uibModalInstance
     * @param SessionService
     * @param SymbolGroupResource
     * @param ToastService
     * @param EventBus
     */
    // @ngInject
    constructor($uibModalInstance, SessionService, SymbolGroupResource, ToastService, EventBus) {
        this.$uibModalInstance = $uibModalInstance;
        this.SymbolGroupResource = SymbolGroupResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The new symbol group
         * @type {SymbolGroup}
         */
        this.group = new SymbolGroup();

        /**
         * An error message that can be displayed in the modal template
         * @type {String|null}
         */
        this.errorMsg = null;
    }


    /** Creates a new symbol group and closes the modal on success and passes the newly created symbol group */
    createGroup() {
        this.errorMsg = null;

        this.SymbolGroupResource.create(this.project.id, this.group)
            .then(createdGroup => {
                this.ToastService.success('Symbol group <strong>' + createdGroup.name + '</strong> created');
                this.EventBus.emit(events.GROUP_CREATED, {
                    group: createdGroup
                });
                this.$uibModalInstance.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            });
    }

    /** Close the modal. */
    close() {
        this.$uibModalInstance.dismiss();
    }
}


/**
 * The directive for handling the opening of the modal for creating a new symbol group. Can only be used as
 * an attribute and attaches a click event to its source element.
 *
 * Use: '<button symbol-group-create-modal-handle>Click Me!</button>'
 *
 * @param $uibModal - The ui.bootstrap $modal service
 * @returns {{restrict: string, link: link}}
 */
// @ngInject
export function symbolGroupCreateModalHandle($uibModal) {
    return {
        restrict: 'A',
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $uibModal.open({
                templateUrl: 'html/directives/modals/symbol-group-create-modal.html',
                controller: SymbolGroupCreateModalController,
                controllerAs: 'vm'
            });
        });
    }
}