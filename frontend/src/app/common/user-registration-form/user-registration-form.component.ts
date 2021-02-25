/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../services/form-utils.service';

/**
 * The component controller for the user registration form.
 */
@Component({
  selector: 'user-registration-form',
  templateUrl: './user-registration-form.component.html'
})
export class UserRegistrationFormComponent {

  @Output()
  signedUp = new EventEmitter<any>();

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z0-9]*'), Validators.maxLength(32)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private userApi: UserApiService,
              private toastService: ToastService,
              public formUtils: FormUtilsService) {
  }

  /**
   * Creates a new user.
   */
  signUp(): void {
    const value = this.form.value;

    this.userApi.create({username: value.username, email: value.email, password: value.password} as any).subscribe(
      () => {
        this.toastService.success('Registration successful. You can now use the credentials to login.');
        this.signedUp.emit({email: value.email, password: value.password});
      },
      response => this.toastService.danger(`Registration failed. ${response.error.message}`)
    );
  }
}
