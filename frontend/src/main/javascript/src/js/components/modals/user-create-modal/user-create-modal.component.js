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

export const userCreateModalComponent = {
    template: require('./user-create-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&'
    },
    controllerAs: 'vm',
    controller: class UserCreateModalComponent {

        /**
         * Constructor.
         *
         * @param {UserResource} UserResource
         * @param {ToastService} ToastService
         */
        // @ngInject
        constructor(UserResource, ToastService) {
            this.userResource = UserResource;
            this.toastService = ToastService;

            /**
             * The user to create.
             * @type {User}
             */
            this.user = new User({role: userRole.REGISTERED});

            /**
             * The error message.
             * @type {string}
             */
            this.errorMessage = null;
        }

        createUser() {
            this.errorMessage = null;
            this.userResource.create(this.user)
                .then(res => {
                    this.toastService.success('The user has been created.');
                    this.close({$value: new User(res.data)});
                })
                .catch(err => this.errorMessage = `Could not create the user. ${err.data.message}`);
        }
    }
};
