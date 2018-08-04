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

import {User} from '../entities/user';

export class UserService {

    /**
     * Constructor.
     *
     * @param {ProjectService} ProjectService
     */
    // @ngInject
    constructor(ProjectService) {
        this.projectService = ProjectService;

        /**
         * The store.
         * @type {{currentUser: ?User, jwt: ?string}}
         */
        this.store = {
            currentUser: null,
            jwt: null,
        };

        // load user from session
        const userInSession = localStorage.getItem('user');
        if (userInSession != null) {
            this.store.currentUser = new User(JSON.parse(userInSession));
            const jwtInSession = localStorage.getItem('jwt');
            if (jwtInSession != null) {
                this.store.jwt = jwtInSession;
            }
        }
    }

    login(user, jwt = null) {
        localStorage.setItem('user', JSON.stringify(user));
        this.store.currentUser = user;
        if (jwt) {
            localStorage.setItem('jwt', jwt);
            this.store.jwt = jwt;
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        this.store.currentUser = null;
        this.store.jwt = null;
        this.projectService.reset();
    }
}
