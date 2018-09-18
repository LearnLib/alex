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

import {User} from '../../../entities/user';

/**
 * The component controller for the user login form.
 */
class UserLoginFormComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param {UserResource} UserResource
     * @param jwtHelper
     * @param {ToastService} ToastService
     * @param {SettingsResource} SettingsResource
     * @param {UserService} UserService
     */
    // @ngInject
    constructor($state, UserResource, jwtHelper, ToastService, SettingsResource, UserService) {
        this.$state = $state;
        this.UserResource = UserResource;
        this.jwtHelper = jwtHelper;
        this.ToastService = ToastService;
        this.SettingsResource = SettingsResource;
        this.UserService = UserService;

        /**
         * The email of the user.
         * @type {string}
         */
        this.email = null;

        /**
         * The password of the user.
         * @type {string}
         */
        this.password = null;

        this.settings = null;

        this.SettingsResource.get()
            .then(settings => this.settings = settings)
            .catch(err => this.ToastService.danger(`Could not get settings. ${err.data.message}`));
    }

    /**
     * Logs in the user.
     */
    login() {
        if (this.email && this.password) {
            this.UserResource.login(this.email, this.password)
                .then(response => {
                    this.ToastService.info('You have logged in!');

                    // decode the token and create a user from it
                    const token = response.data.token;
                    const tokenPayload = this.jwtHelper.decodeToken(token);
                    const user = new User({
                        id: tokenPayload.id,
                        role: tokenPayload.role,
                        email: tokenPayload.email
                    });

                    this.UserService.login(user, token);
                    if (this.onLoggedIn != null) {
                        this.onLoggedIn();
                    }
                })
                .catch(() => {
                    this.ToastService.danger('Login failed');
                });
        } else {
            this.ToastService.info('Make sure your inputs are valid.');
        }
    }

    /**
     * Creates a new user.
     */
    signUp() {
        if (this.email && this.password) {
            this.UserResource.create({email: this.email, password: this.password})
                .then(() => {
                    this.ToastService.success('Registration successful. You can now use the credentials to login.');
                })
                .catch(response => {
                    this.ToastService.danger(`Registration failed. ${response.data.message}`);
                });
        } else {
            this.ToastService.info('Make sure your inputs are valid.');
        }
    }
}

export const userLoginFormComponent = {
    template: require('./user-login-form.component.html'),
    bindings: {
        onLoggedIn: '&'
    },
    controller: UserLoginFormComponent,
    controllerAs: 'vm'
};
