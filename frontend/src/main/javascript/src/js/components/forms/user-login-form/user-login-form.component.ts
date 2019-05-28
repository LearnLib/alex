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
import {UserResource} from '../../../services/resources/user-resource.service';
import {ToastService} from '../../../services/toast.service';
import {SettingsResource} from '../../../services/resources/settings-resource.service';
import {UserService} from '../../../services/user.service';

/**
 * The component controller for the user login form.
 */
class UserLoginFormComponent {

  public onLoggedIn: () => void;

  /** The email of the user. */
  public email: string = null;

  /** The password of the user. */
  public password: string = null;

  public settings: any = null;

  /**
   * Constructor.
   *
   * @param $state
   * @param userResource
   * @param jwtHelper
   * @param toastService
   * @param settingsResource
   * @param userService
   */
  /* @ngInject */
  constructor(private $state: any,
              private userResource: UserResource,
              private jwtHelper: any,
              private toastService: ToastService,
              private settingsResource: SettingsResource,
              private userService: UserService) {

    this.settingsResource.get()
      .then(settings => this.settings = settings)
      .catch(err => this.toastService.danger(`Could not get settings. ${err.data.message}`));
  }

  /**
   * Logs in the user.
   */
  login(): void {
    if (this.email && this.password) {
      this.userResource.login(this.email, this.password)
        .then(response => {
          this.toastService.info('You have logged in!');

          // decode the token and create a user from it
          const token = response.data.token;
          const tokenPayload = this.jwtHelper.decodeToken(token);
          const user = new User({
            id: tokenPayload.id,
            role: tokenPayload.role,
            email: tokenPayload.email
          });

          this.userService.login(user, token);
          if (this.onLoggedIn != null) {
            this.onLoggedIn();
          }
        })
        .catch(() => {
          this.toastService.danger('Login failed');
        });
    } else {
      this.toastService.info('Make sure your inputs are valid.');
    }
  }

  /**
   * Creates a new user.
   */
  signUp(): void {
    if (this.email && this.password) {
      this.userResource.create(<any> {email: this.email, password: this.password})
        .then(() => {
          this.toastService.success('Registration successful. You can now use the credentials to login.');
        })
        .catch(response => {
          this.toastService.danger(`Registration failed. ${response.data.message}`);
        });
    } else {
      this.toastService.info('Make sure your inputs are valid.');
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
