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

import {events} from "../../constants";

/**
 * The controller for the admin users page.
 */
class AdminUsersView {

    /**
     * Constructor.
     *
     * @param $scope
     * @param {UserResource} UserResource
     * @param {EventBus} EventBus
     * @param {SessionService} SessionService
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor($scope, UserResource, EventBus, SessionService, ToastService) {
        this.UserResource = UserResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

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

        // listen on user updated event
        EventBus.on(events.USER_UPDATED, (evt, data) => {
            const user = data.user;
            const i = this.users.findIndex(u => u.id === user.id);
            if (i > -1) this.users[i] = user;
        }, $scope);

        // listen on user deleted event
        EventBus.on(events.USER_DELETED, (evt, data) => {
            const i = this.users.findIndex(u => u.id === data.user.id);
            if (i > -1) this.users.splice(i, 1);
        }, $scope);
    }

    /**
     * Deletes selected users which are not admins.
     */
    deleteSelectedUsers() {
        const ids = this.selectedUsers.filter(user => user.role !== 'ADMIN')
            .map(user => user.id);

        this.UserResource.removeManyUsers(ids)
            .then(() => {
                this.ToastService.success('The users have been deleted');
                ids.forEach(id => this.EventBus.emit(events.USER_DELETED, {user: {id: id}}));
            })
            .catch(response => {
                this.ToastService.danger(`Deleting failed! ${response.data.message}`);
            });
    }
}

export const adminUsersView = {
    controller: AdminUsersView,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/admin-users.html'
};