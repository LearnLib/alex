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

import {UserResource} from '../../../services/resources/user-resource.service';
import {UserService} from '../../../services/user.service';
import {ToastService} from '../../../services/toast.service';
import {User} from '../../../entities/user';

/**
 * The component of the user settings page.
 */
export const profileViewComponent = {
  template: require('./profile-view.component.html'),
  controllerAs: 'vm',
  controller: class ProfileViewComponent {

    /** The user to edit. */
    public user: User;

    /**
     * Constructor.
     *
     * @param userResource
     * @param userService
     * @param toastService
     */
    // @ngInject
    constructor(private userResource: UserResource,
                private userService: UserService,
                private toastService: ToastService) {

      this.user = null;

      // fetch the user from the api
      this.userResource.get(this.userService.store.currentUser.id)
        .then(user => this.user = user)
        .catch(err => this.toastService.danger(`Loading the user failed. ${err.data.message}`));
    }
  }
};
