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

/**
 * The controller for the admin users page.
 */
class AdminUsersViewComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param {UserResource} UserResource
     * @param {SessionService} SessionService
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor($scope, UserResource, SessionService, ToastService) {
        this.UserResource = UserResource;
        this.ToastService = ToastService;

        /**
         * The user that is logged in.
         * @type {null|User}
         */
        this.user = SessionService.getUser();

        /**
         * All registered users.
         * @type {User[]}
         */
        this.users = [];

        /**
         * All selected users.
         * @type {User[]}
         */
        this.selectedUsers = [];

        // fetch all users from the server
        UserResource.getAll()
            .then(users => {
                this.users = users;
            })
            .catch(response => {
                ToastService.danger(`Loading users failed! ${response.data.message}`);
            });
    }

    /**
     * Removes a user from the list.
     * @param {User} user
     */
    removeUser(user) {
        const i = this.users.findIndex(u => u.id === user.id);
        if (i > -1) this.users.splice(i, 1);
    }

    /**
     * Updates a user in the list.
     * @param {User} user
     */
    updateUser(user) {
        const i = this.users.findIndex(u => u.id === user.id);
        if (i > -1) this.users[i] = user;
    }

    /**
     * Deletes selected users which are not admins.
     */
    deleteSelectedUsers() {
        const users = this.selectedUsers.filter(user => user.role !== 'ADMIN');

        if (!users.length) {
            this.ToastService.info('You have to select at least one user.');
            return;
        }

        const ids = users.map(u => u.id);
        this.UserResource.removeManyUsers(ids)
            .then(() => {
                this.ToastService.success('The users have been deleted');
                users.forEach(user => this.removeUser(user));
            })
            .catch(response => {
                this.ToastService.danger(`Deleting failed! ${response.data.message}`);
            });
    }
}

export const adminUsersViewComponent = {
    controller: AdminUsersViewComponent,
    controllerAs: 'vm',
    template: require('./admin-users-view.component.html')
};
