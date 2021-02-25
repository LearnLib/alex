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


import { Component } from '@angular/core';
import { User } from '../../entities/user';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppStoreService } from '../../services/app-store.service';
import { ToastService } from '../../services/toast.service';
import { UserApiService } from '../../services/api/user-api.service';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'profile-view',
  templateUrl: './profile-view.component.html'
})
export class ProfileViewComponent {

  user: User;

  passwordForm: FormGroup = new FormGroup({
    old: new FormControl('', [Validators.required]),
    new: new FormControl('', [])
  });

  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private promptService: PromptService,
              private userApi: UserApiService,
              private toastService: ToastService,
              private appStore: AppStoreService) {

    this.userApi.myself().subscribe(
      user => {
        this.user = user;
        this.emailForm.controls.email.setValue(user.email);
      }
    );

    this.passwordForm.controls.new.setValidators([Validators.required, (c: FormControl) => {
      const valid = c.value != null && c.value.trim !== '' && c.value === this.passwordForm.controls.old.value;
      return valid ? {validatePasswords: true} : null;
    }]);
  }

  /**
   * Changes the email of the user.
   */
  changeEmail(): void {
    this.userApi.changeEmail(this.user, this.emailForm.controls.email.value).subscribe(
      () => {
        this.toastService.success('The email has been changed');

        // update the jwt correspondingly
        const user = this.user.copy();
        user.email = this.emailForm.controls.email.value;
        this.appStore.login(user);
      },
      response => {
        this.toastService.danger('The email could not be changed. ' + response.error.message);
      }
    );
  }

  /**
   * Changes the password of the user.
   */
  changePassword(): void {
    this.userApi.changePassword(this.user, this.passwordForm.controls.old.value, this.passwordForm.controls.new.value).subscribe(
      () => {
        this.toastService.success('The password has been changed');
        this.passwordForm.reset();
      },
      response => {
        this.toastService.danger('There has been an error. ' + response.error.message);
      }
    );
  }

  deleteProfile(): void {
    this.promptService.confirm('Do you really want to delete this profile? All data will be permanently deleted.')
      .then(() => {
        this.userApi.remove(this.user).subscribe(
          () => {
            this.toastService.success('Your account has been deleted');
            this.appStore.logout(true);
          },
          response => {
            this.toastService.danger('The profile could not be deleted. ' + response.error.message);
          }
        );
      }).catch(() => {
    });
  }

  isInvalidFormControl(c: AbstractControl): boolean {
    return c.invalid && (c.dirty || c.touched);
  }
}
