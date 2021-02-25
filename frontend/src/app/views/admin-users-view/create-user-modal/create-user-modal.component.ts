/*
 * Copyright 2015 - 2020 TU Dortmund
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
import { UserApiService } from '../../../services/api/user-api.service';
import { ToastService } from '../../../services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

@Component({
  selector: 'create-user-modal',
  templateUrl: './create-user-modal.component.html'
})
export class CreateUserModalComponent {

  /** The error message. */
  errorMessage: string;

  form: FormGroup;

  constructor(private userApi: UserApiService,
              private toastService: ToastService,
              public modal: NgbActiveModal,
              public formUtils: FormUtilsService) {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z0-9]*'), Validators.maxLength(32)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      role: new FormControl('REGISTERED', [Validators.required])
    });
  }

  createUser(): void {
    this.errorMessage = null;

    const user: any = {};
    user.username = this.form.controls.username.value;
    user.email = this.form.controls.email.value;
    user.password = this.form.controls.password.value;
    user.role = this.form.controls.role.value;

    this.userApi.create(user).subscribe(
      createdUser => {
        this.toastService.success('The user has been created.');
        this.modal.close(createdUser);
      },
      res => this.errorMessage = `Could not create the user. ${res.error.message}`
    );
  }

  isInvalidFormControl(c: AbstractControl): boolean {
    return c.invalid && (c.dirty || c.touched);
  }
}
