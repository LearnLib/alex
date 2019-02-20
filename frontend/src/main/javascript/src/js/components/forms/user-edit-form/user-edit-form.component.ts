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

import {User} from '../../../entities/user';
import {ToastService} from '../../../services/toast.service';
import {UserResource} from '../../../services/resources/user-resource.service';
import {PromptService} from '../../../services/prompt.service';
import {ProjectService} from '../../../services/project.service';
import {UserService} from '../../../services/user.service';

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

  /**
   * Constructor.
   *
   * @param $state
   * @param toastService
   * @param userResource
   * @param promptService
   * @param projectService
   * @param userService
   */
  /* @ngInject */
  constructor(private $state: any,
              private toastService: ToastService,
              private userResource: UserResource,
              private promptService: PromptService,
              private projectService: ProjectService,
              private userService: UserService) {
  }

  $onInit(): void {
    this.email = this.user.email;
  }

  /**
   * Changes the email of the user.
   */
  changeEmail(): void {
    if (this.email !== '') {
      this.userResource.changeEmail(this.user, this.email)
        .then(() => {
          this.toastService.success('The email has been changed');

          // update the jwt correspondingly
          const user = new User(JSON.parse(JSON.stringify(this.currentUser)));
          user.email = this.email;
          this.userService.login(user);
        })
        .catch(response => {
          this.toastService.danger('The email could not be changed. ' + response.data.message);
        });
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

    this.userResource.changePassword(this.user, this.oldPassword, this.newPassword)
      .then(() => {
        this.toastService.success('The password has been changed');
        this.oldPassword = '';
        this.newPassword = '';
      })
      .catch(response => {
        this.toastService.danger('There has been an error. ' + response.data.message);
      });
  }

  /**
   * Deletes the user, removes the jwt on success and redirects to the index page.
   */
  deleteUser(): void {
    this.promptService.confirm('Do you really want to delete this profile? All data will be permanently deleted.')
      .then(() => {
        this.userResource.remove(this.user)
          .then(() => {
            this.toastService.success('The profile has been deleted');
            this.projectService.close();
            this.userService.logout();
            this.$state.go('root');
          })
          .catch(response => {
            this.toastService.danger('The profile could not be deleted. ' + response.data.message);
          });
      });
  }

  get currentUser(): User {
    return this.userService.store.currentUser;
  }
}

export const userEditFormComponent = {
  template: require('./user-edit-form.component.html'),
  bindings: {
    user: '='
  },
  controller: UserEditFormComponent,
  controllerAs: 'vm'
};
