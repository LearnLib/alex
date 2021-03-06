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

import { Component, Input } from '@angular/core';
import { UserApiService } from '../../../services/api/user-api.service';
import { ToastService } from '../../../services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';
import { ProjectApiService } from '../../../services/api/project-api.service';
import { Project } from '../../../entities/project';
import { User } from '../../../entities/user';
import { Selectable } from '../../../utils/selectable';

@Component({
  selector: 'add-user-modal',
  templateUrl: './add-user-modal.component.html'
})
export class AddUserModalComponent {

  @Input()
  public project: Project;

  /** The error message. */
  errorMessage: string;

  /** All selected users. */
  usersSelectable: Selectable<User, number>;

  /** All found users. */
  foundUsers: User[] = [];

  submitted = false;

  searchForm = new FormGroup({
    value: new FormControl('', [Validators.required])
  });

  constructor(private userApi: UserApiService,
              private toastService: ToastService,
              private projectApi: ProjectApiService,
              public modal: NgbActiveModal,
              public formUtils: FormUtilsService) {
    this.usersSelectable = new Selectable<User, number>(u => u.id);
  }

  addUser(): void {
    this.errorMessage = null;

    this.projectApi.addMembers(this.project.id, this.usersSelectable.getSelected().map(user => user.id)).subscribe(() => {
      this.toastService.success('Users have been added to the project.');
      this.modal.close(this.usersSelectable.getSelected());
    }, res => this.errorMessage = `Could not add users to project. ${res.error.message}`
    );
  }

  searchUser() {
    this.submitted = true;
    this.userApi.getByUsernameOrEmail(this.searchForm.controls.value.value).subscribe(users => {
      this.foundUsers = users;
      this.usersSelectable.clear();
      this.usersSelectable.addItems(users);
    });
  }
}
