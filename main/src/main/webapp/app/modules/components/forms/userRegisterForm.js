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

import {UserFormModel} from '../../entities/User';

/** The controller for the user register form component */
// @ngInject
class UserRegisterFrom {

    /**
     * Constructor
     * @param UserResource
     * @param ToastService
     */
    constructor(UserResource, ToastService) {
        this.UserResource = UserResource;
        this.ToastService = ToastService;


        /**
         * The user to create
         * @type {UserFormModel}
         */
        this.user = new UserFormModel();
    }

    register() {
        if (this.user.email && this.user.password) {
            this.UserResource.create(this.user)
                .then(() => {
                    this.ToastService.success('Registration successful');
                    this.user = new UserFormModel();
                })
                .catch(response => {
                    this.ToastService.danger(`Registration failed. ${response.data.message}`);
                });
        } else {
            this.ToastService.info('Make sure your inputs are valid.');
        }
    }
}

const userRegisterForm = {
    controller: UserRegisterFrom,
    controllerAs: 'vm',
    template: `
        <form ng-submit="vm.register()">
            <div class="form-group">
                <label>Email</label>
                <input type="text" class="form-control" placeholder="Email address" ng-model="vm.user.email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" placeholder="Password" ng-model="vm.user.password">
            </div>
            <button class="btn btn-sm btn-block btn-primary">Create Account</button>
        </form>
    `
};

export default userRegisterForm;