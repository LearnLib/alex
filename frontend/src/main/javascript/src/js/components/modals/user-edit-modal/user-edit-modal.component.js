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

import {userRole} from '../../../constants';
import {User} from '../../../entities/user';

/**
 * The controller for the modal window that handles editing a user.
 * This should only be called by an admin.
 */
export class UserEditModalComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param userResource
     * @param toastService
     * @param promptService
     * @param projectService
     * @param userService
     */
    // @ngInject
    constructor($state, userResource, toastService, promptService, projectService, userService) {
        this.$state = $state;
        this.userResource = userResource;
        this.toastService = toastService;
        this.promptService = promptService;
        this.projectService = projectService;
        this.userService = userService;

        /**
         * The error message in case the update goes wrong.
         * @type {?string}
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
         * @type {?string}
         */
        this.email = null;
    }

    $onInit() {
        this.user = this.resolve.user;
        this.email = this.user.email;
    }

    /**
     * Changes the EMail of an user.
     */
    changeEmail() {
        this.error = null;
        this.userResource.changeEmail(this.user, this.email)
            .then((user) => {
                if (this.currentUser.id === this.user.id) {
                    this.userService.login(user);
                }

                this.resolve.onUpdated(user);
                this.dismiss();
                this.toastService.success('The email has been changed.');
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
        this.userResource.promote(this.user)
            .then((user) => {
                this.toastService.success('The user now has admin rights.');
                this.resolve.onUpdated(user);
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
        this.userResource.demote(this.user)
            .then((user) => {
                if (this.currentUser.id === this.user.id) {
                    this.projectService.close();
                    this.userService.logout();
                    this.$state.go('root');
                } else {
                    this.resolve.onUpdated(user);
                }
                this.dismiss();
                this.toastService.success('The user now has default user rights.');
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
        this.promptService.confirm('Do you want to delete this user permanently?')
            .then(() => {
                this.userResource.remove(this.user)
                    .then(() => {
                        this.toastService.success('The user has been deleted');
                        this.resolve.onDeleted(this.user);
                        this.dismiss();
                    })
                    .catch(response => {
                        this.error = response.data.message;
                    });
            });
    }

    get currentUser() {
        return this.userService.store.currentUser;
    }
}

export const userEditModalComponent = {
    template: require('./user-edit-modal.component.html'),
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: UserEditModalComponent,
    controllerAs: 'vm',
};
