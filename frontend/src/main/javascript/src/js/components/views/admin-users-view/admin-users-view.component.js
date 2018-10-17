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

import remove from 'lodash/remove';
import {User} from '../../../entities/user';
import {Selectable} from '../../../utils/selectable';

/**
 * The controller for the admin users page.
 */
class AdminUsersViewComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param userResource
     * @param toastService
     * @param $uibModal
     * @param userService
     */
    // @ngInject
    constructor($scope, userResource, toastService, $uibModal, userService) {
        this.userResource = userResource;
        this.toastService = toastService;
        this.$uibModal = $uibModal;
        this.userService = userService;

        /**
         * All registered users.
         * @type {User[]}
         */
        this.users = [];

        /**
         * All selected users.
         * @type {Selectable}
         */
        this.selectedUsers = new Selectable(this.users, 'id');

        // fetch all users from the server
        this.userResource.getAll()
            .then(users => {
                this.users = users;
                this.selectedUsers = new Selectable(this.users, 'id');
            })
            .catch(err => {
                this.toastService.danger(`Loading users failed! ${err.data.message}`);
            });
    }

    /**
     * Removes a user from the list.
     * @param {User} user
     */
    removeUser(user) {
        remove(this.users, {id: user.id});
    }

    updateUser(user) {
        const i = this.users.findIndex(u => u.id === user.id);
        this.users[i] = user;
        this.selectedUsers.update(user);
    }

    createUser() {
        this.$uibModal.open({
            component: 'userCreateModal',
        }).result.then(createdUser => this.users.push(createdUser));
    }

    /**
     * Updates a user in the list.
     * @param {User} user
     */
    editUser(user) {
        this.$uibModal.open({
            component: 'userEditModal',
            resolve: {
                user: () => new User(user),
                onUpdated: () => (u) => this.updateUser(u),
                onDeleted: () => (u) => this.removeUser(u)
            }
        });
    }

    /**
     * Deletes selected users which are not admins.
     */
    deleteSelectedUsers() {
        const users = this.selectedUsers.getSelected().filter(u => u.id !== this.user.id);
        if (users.length === 0) {
            this.toastService.info('You have to select at least one user.');
            return;
        }

        const ids = users.map(u => u.id);
        this.userResource.removeManyUsers(ids)
            .then(() => {
                this.toastService.success('The users have been deleted');
                users.forEach(user => this.removeUser(user));
            })
            .catch(err => {
                this.toastService.danger(`Deleting failed! ${err.data.message}`);
            });
    }

    get user() {
        return this.userService.store.currentUser;
    }
}

export const adminUsersViewComponent = {
    controller: AdminUsersViewComponent,
    controllerAs: 'vm',
    template: require('./admin-users-view.component.html')
};
