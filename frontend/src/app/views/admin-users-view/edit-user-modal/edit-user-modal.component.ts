/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { User, UserRole } from '../../../entities/user';
import { UserApiService } from '../../../services/api/user-api.service';
import { ToastService } from '../../../services/toast.service';
import { PromptService } from '../../../services/prompt.service';
import { AppStoreService } from '../../../services/app-store.service';
import { userRole } from '../../../constants';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'edit-user-modal',
  templateUrl: './edit-user-modal.component.html'
})
export class EditUserModalComponent implements OnInit {

  /** The user under edit. */
  @Input()
  user: User;

  /** Available user roles. */
  userRole: any = userRole;

  /** The error message to display. */
  error: string = null;

  processesForm: FormGroup;

  /** The email of the user. */
  emailForm: FormGroup;

  /** The username of the user. */
  usernameForm: FormGroup;

  maxProcessesRange = 10;

  updated: EventEmitter<User>;
  deleted: EventEmitter<User>;

  constructor(private userApi: UserApiService,
              private toastService: ToastService,
              private promptService: PromptService,
              private appStore: AppStoreService,
              public modal: NgbActiveModal) {
    this.updated = new EventEmitter<User>();
    this.deleted = new EventEmitter<User>();

    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.usernameForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z0-9]*'), Validators.maxLength(32)]),
    });

    this.processesForm = new FormGroup({
      processes: new FormControl('', [Validators.min(1)])
    });
  }

  get currentUser(): User {
    return this.appStore.user;
  }

  ngOnInit(): void {
    this.usernameForm.controls.username.setValue(this.user.username);
    this.emailForm.controls.email.setValue(this.user.email);
    this.processesForm.controls.processes.setValue(this.user.maxAllowedProcesses);
  }

  changeMaxAllowedProcesses(): void {
    this.error = null;
    this.userApi.changeMaxAllowedProcesses(this.user, this.processesForm.controls.processes.value).subscribe({
      next: user => {
        this.toastService.success('The maximum number of allowed processes has been changed.');
        this.updated.emit(user);
        this.modal.dismiss();
      },
      error: response => {
        this.error = response.error.message;
      }
    });
  }

  /**
   * Changes the username of an user.
   */
  changeUsername(): void {
    this.error = null;
    this.userApi.changeUsername(this.user, this.usernameForm.controls.username.value).subscribe({
      next: user => {
        this.toastService.success('The username has been changed.');
        this.updated.emit(user);
        this.modal.dismiss();
      },
      error: response => {
        this.error = response.error.message;
      }
    });
  }

  /**
   * Changes the EMail of an user.
   */
  changeEmail(): void {
    this.error = null;
    this.userApi.changeEmail(this.user, this.emailForm.controls.email.value).subscribe({
      next: user => {
        if (this.currentUser.id === this.user.id) {
          this.appStore.login(user);
        }

        this.toastService.success('The email has been changed.');
        this.updated.emit(user);
        this.modal.dismiss();
      },
      error: response => {
        this.error = response.error.message;
      }
    });
  }

  /**
   * Gives a user admin rights.
   */
  promoteUser(): void {
    this.error = null;
    this.userApi.changeRole(this.user, UserRole.ADMIN).subscribe(
      user => {
        this.toastService.success('The user now has admin rights.');
        this.updated.emit(user);
        this.modal.dismiss();
      },
      response => {
        this.error = response.error.message;
      }
    );
  }

  /**
   * Removes the admin rights of a user. If an admin removes his own rights
   * he will be logged out automatically.
   */
  demoteUser(): void {
    this.error = null;
    this.userApi.changeRole(this.user, UserRole.REGISTERED).subscribe(
      user => {
        if (this.currentUser.id === this.user.id) {
          this.appStore.logout(true);
        } else {
          this.updated.emit(user);
        }
        this.modal.dismiss();
        this.toastService.success('The user now has default user rights.');
      },
      response => {
        this.error = response.error.message;
      }
    );
  }

  /**
   * Deletes a user.
   */
  deleteUser(): void {
    this.error = null;
    this.promptService.confirm('Do you want to delete this user permanently?')
      .then(() => {
        this.userApi.remove(this.user).subscribe(
          () => {
            this.toastService.success('The user has been deleted');
            this.deleted.emit(this.user);
            this.modal.dismiss();
          },
          response => {
            this.error = response.error.message;
          }
        );
      });
  }

  isInvalidFormControl(c: AbstractControl): boolean {
    return c.invalid && (c.dirty || c.touched);
  }

  getMaxProcessesRange() {
    if (this.maxProcessesRange < this.processesForm.controls.processes.value) {
      this.maxProcessesRange = this.processesForm.controls.processes.value;
    }
    return this.maxProcessesRange;
  }
}
