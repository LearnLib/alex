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
import { ToastService } from '../../../services/toast.service';
import { UserApiService } from '../../../services/resources/user-api.service';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The component for the form to edit the password and the email of a user or to delete the user.
 */
class UserEditFormComponent {

  public user: User;

  /** The model for the input of the old password. */
  public oldPassword: string = '';

  /** The model for the input of the new password. */
  public newPassword: string = '';

  /** The model for the input of the users mail. */
  public email: string = null;

  /* @ngInject */
  constructor(private $state: any,
              private toastService: ToastService,
              private userApi: UserApiService,
              private appStore: AppStoreService) {
  }

  $onInit(): void {
    this.email = this.user.email;
  }

  /**
   * Changes the email of the user.
   */
  changeEmail(): void {
    if (this.email !== '') {
      this.userApi.changeEmail(this.user, this.email).subscribe(
        () => {
          this.toastService.success('The email has been changed');

          // update the jwt correspondingly
          const user = this.currentUser.copy();
          user.email = this.email;
          this.appStore.login(user);
        },
        response => {
          this.toastService.danger('The email could not be changed. ' + response.data.message);
        }
      );
    }
  }

  /**
   * Changes the password of the user.
   */
  changePassword(): void {
    if (this.oldPassword === '' || this.newPassword === '') {
      this.toastService.info('Both passwords have to be entered');
      return;
    }

    if (this.oldPassword === this.newPassword) {
      this.toastService.info('The new password should be different from the old one');
      return;
    }

    this.userApi.changePassword(this.user, this.oldPassword, this.newPassword).subscribe(
      () => {
        this.toastService.success('The password has been changed');
        this.oldPassword = '';
        this.newPassword = '';
      },
      response => {
        this.toastService.danger('There has been an error. ' + response.data.message);
      }
    );
  }

  get currentUser(): User {
    return this.appStore.user;
  }
}

export const userEditFormComponent = {
  template: require('html-loader!./user-edit-form.component.html'),
  bindings: {
    user: '='
  },
  controller: UserEditFormComponent,
  controllerAs: 'vm'
};
