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

import {User} from "../../entities/User";
import {userRole} from "../../constants";

/**
 * The controller for the modal window that handles editing a user.
 * This should only be called by an admin.
 */
export class UserEditModalComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param {UserResource} UserResource
     * @param {ToastService} ToastService
     * @param {PromptService} PromptService
     * @param {SessionService} SessionService
     */
    // @ngInject
    constructor($state, UserResource, ToastService, PromptService, SessionService) {
        this.$state = $state;
        this.UserResource = UserResource;
        this.ToastService = ToastService;
        this.PromptService = PromptService;
        this.SessionService = SessionService;

        /**
         * The error message in case the update goes wrong.
         * @type {null|string}
         */
        this.error = null;

        /**
         * The user role dictionary.
         * @type {object}
         */
        this.userRole = userRole;

        /**
         * The user to edit.
         * @type {User}
         */
        this.user = null;

        /**
         * The model for the input of the users mail.
         * @type {string}
         */
        this.email = null;
    }

    $onInit() {
        this.user = this.resolve.modalData.user;
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
                this.resolve.modalData.onUpdated({user});
                this.dismiss();
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
                this.ToastService.success('The user now has admin rights.');
                this.resolve.modalData.onUpdated({user});
                this.dismiss();
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
                    this.resolve.modalData.onUpdated({user});
                }
                this.dismiss();
                this.ToastService.success('The user now has default user rights.');
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }

    /**
     * Deletes a user.
     */
    deleteUser() {
        this.error = null;
        this.PromptService.confirm('Do you want to delete this user permanently?')
            .then(() => {
                this.UserResource.remove(this.user)
                    .then(() => {
                        this.ToastService.success('The user has been deleted');
                        this.resolve.modalData.onDeleted({user: this.user});
                        this.dismiss();
                    })
                    .catch(response => {
                        this.error = response.data.message;
                    });
            });
    }
}


export const userEditModalComponent = {
    templateUrl: 'html/components/modals/user-edit-modal.html',
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: UserEditModalComponent,
    controllerAs: 'vm',
};


/**
 * The directive that opens the modal window for editing a user.
 * The directive should only be used as an attribute.
 *
 * Usage: <a href="" user-edit-modal-handle user="..."></a>
 * where attribute 'user' expects a user object.
 *
 * @param $uibModal
 * @returns {{scope: {user: string}, restrict: string, link: Function}}
 */
// @ngInject
export function userEditModalHandle($uibModal) {
    return {
        scope: {
            user: '=',
            onDeleted: '&',
            onUpdated: '&'
        },
        restrict: 'A',
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'userEditModal',
                    resolve: {
                        modalData: () => {
                            return {
                                user: new User(scope.user),
                                onUpdated: scope.onUpdated,
                                onDeleted: scope.onDeleted
                            };
                        }
                    }
                });
            });
        }
    };
}