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

/** The controller for the admin users page */
// @ngInject
class AdminUsersView {

    /**
     * Constructor
     * @param $scope
     * @param UserResource
     * @param EventBus
     * @param SessionService
     * @param ToastService
     */
    constructor($scope, UserResource, EventBus, SessionService, ToastService) {

        // the user from the jwt
        const user = SessionService.getUser();

        /**
         * The user to edit
         * @type {null|User}
         */
        this.user = null;

        // fetch the user from the api
        UserResource.get(user.id)
            .then(user => {
            this.user = user;
        })
        .catch(response => {
                ToastService.danger(`Loading the user failed. ${response.data.message}`);
        });

        /**
         * All registered users
         * @type {User[]}
         */
        this.users = [];

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
}

export const adminUsersView = {
    controller: AdminUsersView,
    controllerAs: 'vm',
    templateUrl: 'views/pages/admin-users.html'
};