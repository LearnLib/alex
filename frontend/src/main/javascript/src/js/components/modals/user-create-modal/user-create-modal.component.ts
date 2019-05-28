/*
 * Copyright 2015 - 2019 TU Dortmund
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
import {ModalComponent} from '../modal.component';
import {UserResource} from '../../../services/resources/user-resource.service';
import {ToastService} from '../../../services/toast.service';

export const userCreateModalComponent = {
  template: require('./user-create-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&'
  },
  controllerAs: 'vm',
  controller: class UserCreateModalComponent extends ModalComponent {

    /** The error message. */
    public errorMessage: String = null;

    /** The user to create. */
    public user: User;

    /**
     * Constructor.
     *
     * @param userResource
     * @param toastService
     */
    /* @ngInject */
    constructor(private userResource: UserResource,
                private toastService: ToastService) {
      super();

      this.user = new User({role: userRole.REGISTERED});
    }

    createUser(): void {
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
