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

import {User} from '../../entities/User';
import {events} from '../../constants';

/**
 * The controller for the modal window that handles editing a user.
 * This should only be called by an admin.
 *
 * @param $scope
 * @param $modalInstance
 * @param modalData
 * @param UserResource
 * @param ToastService
 * @param PromptService
 * @param EventBus
 * @constructor
 */
// @ngInject
class UserEditModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param UserResource
     * @param ToastService
     * @param PromptService
     * @param EventBus
     */
    constructor($modalInstance, modalData, UserResource, ToastService, PromptService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.UserResource = UserResource;
        this.ToastService = ToastService;
        this.PromptService = PromptService;
        this.EventBus = EventBus;

        /**
         * The error message in case the update goes wrong
         * @type {null|string}
         */
        this.error = null;

        /**
         * The user to edit
         * @type {User}
         */
        this.user = modalData.user;
    }


    /** Updates the user on the server and closes the modal window on success */
    updateUser() {
        this.error = null;

        this.UserResource.update(this.user)
            .then(() => {
                this.EventBus.emit(events.USER_UPDATED, {user: this.user});
                this.ToastService.success('User updated successfully');
                this.$modalInstance.dismiss();
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }

    /** Deletes a user */
    deleteUser() {
        this.error = null;

        this.PromptService.confirm('Do you want to delete this user permanently?')
            .then(() => {
                this.UserResource.remove(this.user)
                    .then(() => {
                        this.EventBus.emit(events.USER_DELETED, {user: this.user});
                        this.ToastService.success('The user has been deleted');
                        this.$modalInstance.dismiss();
                    })
                    .catch(response => {
                        this.error = response.data.message;
                    });
            });
    }

    /** Closes the modal window */
    close() {
        this.$modalInstance.dismiss();
    }
}


/**
 * The directive that opens the modal window for editing a user.
 * The directive should only be used as an attribute.
 *
 * Usage: <a href="" user-edit-modal-handle user="..."></a>
 * where attribute 'user' expects a user object
 *
 * @param $modal
 * @returns {{scope: {user: string}, restrict: string, link: link}}
 */
// @ngInject
function userEditModalHandle($modal) {
    return {
        scope: {
            user: '='
        },
        restrict: 'A',
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/user-edit-modal.html',
                controller: UserEditModalController,
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {user: new User(scope.user)};
                    }
                }
            });
        });
    }
}

export default userEditModalHandle;