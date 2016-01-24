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
import {SymbolGroupFormModel} from '../../entities/SymbolGroup';

/** The controller for the modal dialog that handles the creation of a new symbol group. */
// @ngInject
class SymbolGroupCreateModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param SessionService
     * @param SymbolGroupResource
     * @param ToastService
     * @param EventBus
     */
    constructor($modalInstance, SessionService, SymbolGroupResource, ToastService, EventBus) {
        this.$modalInstance = $modalInstance;
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
        this.group = new SymbolGroupFormModel();

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
                this.$modalInstance.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            });
    }

    /** Close the modal. */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default SymbolGroupCreateModalController;