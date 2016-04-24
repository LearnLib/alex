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
import {User} from '../../entities/User';

/** The component controller for the user login form */
// @ngInject
class UserLoginForm {

    /**
     * Constructor
     * @param $state
     * @param {UserResource} UserResource
     * @param jwtHelper
     * @param {ToastService} ToastService
     * @param {SessionService} SessionService
     * @param {EventBus} EventBus
     */
    constructor($state, UserResource, jwtHelper, ToastService, SessionService, EventBus) {
        this.$state = $state;
        this.UserResource = UserResource;
        this.jwtHelper = jwtHelper;
        this.ToastService = ToastService;
        this.SessionService = SessionService;
        this.EventBus = EventBus;

        /**
         * The email of the user
         * @type {string}
         */
        this.email = null;

        /**
         * The password of the user
         * @type {string}
         */
        this.password = null;
    }

    login() {
        if (this.email && this.password) {
            this.UserResource.login(this.email, this.password)
                .then(response => {
                    this.ToastService.info('You have logged in!');

                    // decode the token and create a user from it
                    const token = response.data.token;
                    const tokenPayload = this.jwtHelper.decodeToken(token);
                    const user = new User({
                        id: tokenPayload.userId,
                        role: tokenPayload.userRole
                    });

                    this.SessionService.saveUser(user, token);
                    this.EventBus.emit(events.USER_LOGGED_IN, {user: user});
                    this.$state.go('projects');
                })
                .catch(() => {
                    this.ToastService.danger('Login failed');
                });
        }
    }
}

const userLoginForm = {
    controller: UserLoginForm,
    controllerAs: 'vm',
    template: `
        <form name="vm.form" ng-submit="vm.login()" id="user-login-form">
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" name="mail" placeholder="Email address" autofocus required ng-model="vm.email">

                <div class="help-block" ng-messages="vm.form.mail.$error" ng-if="vm.form.mail.$touched">
                    <div class="alert alert-danger alert-condensed" ng-message="required">
                        The email is required
                    </div>
                    <div class="alert alert-danger alert-condensed" ng-message="email">
                        You have to enter a valid email address
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" name="password" placeholder="Password" required ng-minlength="1" ng-model="vm.password">

                <div class="help-block" ng-messages="vm.form.password.$error" ng-if="vm.form.password.$touched">
                    <div class="alert alert-danger alert-condensed" ng-message="required">
                        The password is required
                    </div>
                </div>
            </div>
            <button class="btn btn-sm btn-block btn-primary">Login</button>
        </form>
    `
};

export default userLoginForm;