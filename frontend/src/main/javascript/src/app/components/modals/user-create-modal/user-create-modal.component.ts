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

import { User } from '../../../entities/user';
import { ModalComponent } from '../modal.component';
import { UserApiService } from '../../../services/resources/user-api.service';
import { ToastService } from '../../../services/toast.service';

export const userCreateModalComponent = {
  template: require('html-loader!./user-create-modal.component.html'),
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
     * @param userApi
     * @param toastService
     */
    /* @ngInject */
    constructor(private userApi: UserApiService,
                private toastService: ToastService) {
      super();
      this.user = new User();
    }

    createUser(): void {
      this.errorMessage = null;
      this.userApi.create(this.user).subscribe(
        res => {
          this.toastService.success('The user has been created.');
          this.close({$value: User.fromData(res.data)});
        },
        err => this.errorMessage = `Could not create the user. ${err.data.message}`
      );
    }
  }
};
