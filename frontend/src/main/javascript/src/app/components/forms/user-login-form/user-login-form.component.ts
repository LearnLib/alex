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
import { UserApiService } from '../../../services/resources/user-api.service';
import { ToastService } from '../../../services/toast.service';
import { SettingsApiService } from '../../../services/resources/settings-api.service';
import { AppStoreService } from '../../../services/app-store.service';

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

  /* @ngInject */
  constructor(private $state: any,
              private userApi: UserApiService,
              private jwtHelper: any,
              private toastService: ToastService,
              private settingsApi: SettingsApiService,
              private appStore: AppStoreService) {

    this.settingsApi.get().subscribe(
      settings => this.settings = settings,
      err => this.toastService.danger(`Could not get settings. ${err.data.message}`)
    );
  }

  /**
   * Logs in the user.
   */
  login(): void {
    if (this.email && this.password) {
      this.userApi.login(this.email, this.password).subscribe(data => {
          this.toastService.info('You have logged in!');

          // decode the token and create a user from it
          const token = data.token;
          const tokenPayload = this.jwtHelper.decodeToken(token);
          const user = User.fromData({
            id: tokenPayload.id,
            role: tokenPayload.role,
            email: tokenPayload.email
          });

          this.appStore.login(user, token);
          if (this.onLoggedIn != null) {
            this.onLoggedIn();
          }
        },
        () => {
          this.toastService.danger('Login failed');
        }
      );
    } else {
      this.toastService.info('Make sure your inputs are valid.');
    }
  }

  /**
   * Creates a new user.
   */
  signUp(): void {
    if (this.email && this.password) {
      this.userApi.create(<any> {email: this.email, password: this.password}).subscribe(
        () => this.toastService.success('Registration successful. You can now use the credentials to login.'),
        response => this.toastService.danger(`Registration failed. ${response.data.message}`)
      );
    } else {
      this.toastService.info('Make sure your inputs are valid.');
    }
  }
}

export const userLoginFormComponent = {
  template: require('html-loader!./user-login-form.component.html'),
  bindings: {
    onLoggedIn: '&'
  },
  controller: UserLoginFormComponent,
  controllerAs: 'vm'
};
