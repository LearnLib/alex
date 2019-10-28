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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../entities/user';
import { Selectable } from '../../utils/selectable';
import { UserApiService } from '../../services/api/user-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { removeItems, replaceItem } from '../../utils/list-utils';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal.component';

@Injectable()
export class AdminUsersViewStoreService {

  /** All selected users. */
  usersSelectable: Selectable<User>;

  /** All registered users. */
  private users: BehaviorSubject<User[]>;

  constructor(private userApi: UserApiService,
              private appStore: AppStoreService,
              private modalService: NgbModal,
              private toastService: ToastService) {
    this.users = new BehaviorSubject<User[]>([]);
    this.usersSelectable = new Selectable<User>([], 'id');
  }

  get currentUser(): User {
    return this.appStore.user;
  }

  get users$(): Observable<User[]> {
    return this.users.asObservable();
  }

  load(): void {
    this.userApi.getAll().subscribe(
      users => {
        this.users.next(users);
        this.usersSelectable.addItems(users);
      }
    );
  }

  createUser(): void {
    this.modalService.open(CreateUserModalComponent)
      .result.then((createdUser: User) => {
      this.users.next([...this.users.value, createdUser]);
      this.usersSelectable.addItem(createdUser);
    }).catch(() => {
    });
  }

  /**
   * Updates a user in the list.
   *
   * @param user
   */
  editUser(user: User): void {
    const modalRef = this.modalService.open(EditUserModalComponent);
    modalRef.componentInstance.user = user.copy();
    modalRef.componentInstance.updated.subscribe(updatedUser => {
      this.users.next(replaceItem(this.users.value, u => u.id === updatedUser.id, updatedUser));
      this.usersSelectable.update(updatedUser);
    });
    modalRef.componentInstance.deleted.subscribe(user => {
      this.users.next(removeItems(this.users.value, u => u.id === user.id));
      this.usersSelectable.unselect(user);
    });
    modalRef.result
      .then(() => {
      })
      .catch(() => {
      });
  }

  /**
   * Deletes selected users which are not admins.
   */
  deleteSelectedUsers(): void {
    const users = this.usersSelectable.getSelected().filter(u => u.id !== this.currentUser.id);
    if (users.length === 0) {
      this.toastService.info('You have to select at least one user.');
      return;
    }

    const ids = users.map(u => u.id);
    this.userApi.removeManyUsers(ids).subscribe(
      () => {
        this.toastService.success('The users have been deleted');
        this.users.next(removeItems(this.users.value, (u => ids.indexOf(u.id) > -1)));
        this.usersSelectable.unselectMany(users);
      },
      res => {
        this.toastService.danger(`Deleting failed! ${res.error.message}`);
      }
    );
  }
}