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

import { UserApiService } from '../../services/api/user-api.service';
import { ToastService } from '../../services/toast.service';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../services/form-utils.service';

/**
 * The component controller for the user login form.
 */
@Component({
  selector: 'user-login-form',
  templateUrl: './user-login-form.component.html'
})
export class UserLoginFormComponent {

  @Output()
  loggedIn = new EventEmitter<any>();

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  settings: any;

  constructor(private userApi: UserApiService,
              private toastService: ToastService,
              private settingsApi: SettingsApiService,
              private appStore: AppStoreService,
              public formUtils: FormUtilsService) {

    this.settingsApi.get().subscribe(
      settings => this.settings = settings,
      err => this.toastService.danger(`Could not get settings. ${err.data.message}`)
    );
  }

  /**
   * Logs in the user.
   */
  login(): void {
    const value = this.form.value;

    this.userApi.login(value.email, value.password).subscribe(data => {
        this.toastService.info('You have logged in!');

        // decode the token and create a user from it
        const token = data.token;
        localStorage.setItem('jwt', token);
        this.userApi.myself().subscribe(
          user => {
            this.appStore.login(user, token);
            this.loggedIn.emit();
          },
          console.error
        );
      },
      () => {
        this.toastService.danger('Login failed');
      }
    );
  }

  /**
   * Creates a new user.
   */
  signUp(): void {
    const value = this.form.value;

    this.userApi.create(<any>{email: value.email, password: value.password}).subscribe(
      () => this.toastService.success('Registration successful. You can now use the credentials to login.'),
      response => this.toastService.danger(`Registration failed. ${response.error.message}`)
    );
  }
}
