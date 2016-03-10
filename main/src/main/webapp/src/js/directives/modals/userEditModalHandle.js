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
import {events, userRole} from '../../constants';

/**
 * The controller for the modal window that handles editing a user.
 * This should only be called by an admin.
 */
// @ngInject
class UserEditModalController {

    /**
     * Constructor
     * @param $state
     * @param $uibModalInstance
     * @param modalData
     * @param {UserResource} UserResource
     * @param {ToastService} ToastService
     * @param {PromptService} PromptService
     * @param {EventBus} EventBus
     * @param {SessionService} SessionService
     */
    constructor($state, $uibModalInstance, modalData, UserResource, ToastService, PromptService, EventBus, SessionService) {
        this.$state = $state;
        this.$uibModalInstance = $uibModalInstance;
        this.UserResource = UserResource;
        this.ToastService = ToastService;
        this.PromptService = PromptService;
        this.EventBus = EventBus;
        this.SessionService = SessionService;

        /**
         * The error message in case the update goes wrong
         * @type {null|string}
         */
        this.error = null;

        /**
         * The user role dictionary
         * @type {object}
         */
        this.userRole = userRole;

        /**
         * The user to edit
         * @type {User}
         */
        this.user = modalData.user;

        /**
         * The model for the input of the users mail
         * @type {string}
         */
        this.email = this.user.email;

    }

    /**
     * Changes the EMail of an user.
     */
    changeEmail() {
        this.error = null;
        this.UserResource.changeEmail(this.user, this.email)
            .then((user) => {
                if (this.SessionService.getUser().id === this.user.id) {
                    this.SessionService.saveUser(user);
                }
                this.EventBus.emit(events.USER_UPDATED, {user: user});
                this.$uibModalInstance.dismiss();
                this.ToastService.success('The email has been changed.');
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }

    /**
     * Gives a user admin rights.
     */
    promoteUser() {
        this.error = null;
        this.UserResource.promote(this.user)
            .then((user) => {
                this.EventBus.emit(events.USER_UPDATED, {user: user});
                this.ToastService.success('The user now has admin rights.');
                this.$uibModalInstance.dismiss();
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }

    /**
     * Removes the admin rights of a user. If an admin removes his own rights
     * he will be logged out automatically.
     */
    demoteUser() {
        this.error = null;
        this.UserResource.demote(this.user)
            .then((user) => {
                if (this.SessionService.getUser().id === this.user.id) {
                    this.SessionService.removeProject();
                    this.SessionService.removeUser();
                    this.$state.go('home');
                } else {
                    this.EventBus.emit(events.USER_UPDATED, {user: user});
                }
                this.$uibModalInstance.dismiss();
                this.ToastService.success('The user now has default user rights.');
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }

    /**
     * Deletes a user
     */
    deleteUser() {
        this.error = null;
        this.PromptService.confirm('Do you want to delete this user permanently?')
            .then(() => {
                this.UserResource.remove(this.user)
                    .then(() => {
                        this.EventBus.emit(events.USER_DELETED, {user: this.user});
                        this.ToastService.success('The user has been deleted');
                        this.$uibModalInstance.dismiss();
                    })
                    .catch(response => {
                        this.error = response.data.message;
                    });
            });
    }

    /**
     * Closes the modal window.
     */
    close() {
        this.$uibModalInstance.dismiss();
    }
}


/**
 * The directive that opens the modal window for editing a user.
 * The directive should only be used as an attribute.
 *
 * Usage: <a href="" user-edit-modal-handle user="..."></a>
 * where attribute 'user' expects a user object
 *
 * @param $uibModal
 * @returns {{scope: {user: string}, restrict: string, link: link}}
 */
// @ngInject
function userEditModalHandle($uibModal) {
    return {
        scope: {
            user: '='
        },
        restrict: 'A',
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $uibModal.open({
                templateUrl: 'html/modals/user-edit-modal.html',
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

export {userEditModalHandle, UserEditModalController};