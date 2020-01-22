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
import { BehaviorSubject, Observable, forkJoin, merge} from 'rxjs';
import { User } from '../../entities/user';
import { Selectable } from '../../utils/selectable';
import { UserApiService } from '../../services/api/user-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { removeItems, replaceItem } from '../../utils/list-utils';
import { PromptService } from '../../services/prompt.service';
import {ProjectApiService} from "../../services/api/project-api.service";
import {Project} from "../../entities/project";
import {CreateUserModalComponent} from "../admin-users-view/create-user-modal/create-user-modal.component";
import {AddUserModalComponent} from "./add-user-modal/add-user-modal.component";
import { Router } from '@angular/router';

@Injectable()
export class ProjectUsersViewStoreService {

  /** All registered users. */
  private owners: BehaviorSubject<User[]>;

  private members: BehaviorSubject<User[]>;

  usersSelectable: Selectable<User, number>;

  constructor(private userApi: UserApiService,
              private projectApi: ProjectApiService,
              private appStore: AppStoreService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private promptService: PromptService,
              private router: Router) {
    this.owners = new BehaviorSubject<User[]>([]);
    this.members = new BehaviorSubject<User[]>([]);
    this.usersSelectable = new Selectable<User, number>(u => u.id);
  }

  get currentUser(): User {
    return this.appStore.user;
  }

  get owners$(): Observable<User[]> {
    return this.owners.asObservable();
  }

  get members$(): Observable<User[]> {
    return this.members.asObservable();
  }

  isOwnerSelected(): Boolean {
    return this.usersSelectable.getSelected().find(user => this.owners.getValue().includes(user)) !== undefined;
  }

  isMemberSelected(): Boolean {
    return this.usersSelectable.getSelected().find(user => this.members.getValue().includes(user)) !== undefined;
  }

  load(): void {
    this.usersSelectable.clear();
    if (this.appStore.project.owners.length > 0) {
      this.userApi.getManyUsers(this.appStore.project.owners).subscribe(
        owners => {
          this.owners.next(owners);
          this.usersSelectable.addItems(owners);
        }
      );
    }

    if (this.appStore.project.members.length > 0) {
      this.userApi.getManyUsers(this.appStore.project.members).subscribe(
        members => {
          this.members.next(members);
          this.usersSelectable.addItems(members);
        }
      );
    }
  }

  addUser(): void {
    const modalRef = this.modalService.open(AddUserModalComponent);
    modalRef.componentInstance.project = this.appStore.project;
    modalRef.result.then((addedUsers: User[]) => {
      this.members.next([...this.members.value, ...addedUsers]);
      this.usersSelectable.addItems(addedUsers);

      this.appStore.reloadProject();
    }).catch(() => {
    });
  }

  removeUsers(users: User[]): void {
    this.promptService.confirm("Do you really want to remove the selected users from the project?").then(() => {
      if (this.members.value.includes(users[0])) {
        this.projectApi.removeMembers(this.appStore.project.id, users.map(user => user.id)).subscribe(() => {
          this.members.next(this.members.value.filter(member => !users.includes(member)));
          this.usersSelectable.removeMany(users);
          this.appStore.reloadProject();
        },
        res => {
          this.toastService.danger(`${res.error.message}`);
        })
      }
      if (this.owners.value.includes(users[0])) {
        this.projectApi.removeOwners(this.appStore.project.id, users.map(user => user.id)).subscribe(() => {
          this.owners.next(this.owners.value.filter(owner => !users.includes(owner)));
          this.usersSelectable.removeMany(users);
          this.appStore.reloadProject();
        },
        res => {
          this.toastService.danger(`${res.error.message}`);
        })
      }
    })
  }

  promoteMembers(users: User[]): void {
    this.projectApi.addOwners(this.appStore.project.id, users.map(user => user.id)).subscribe(() => {
      this.owners.next([...this.owners.value, ...users]);
      this.members.next(this.members.value.filter(member => !users.includes(member)));
      this.appStore.reloadProject();
    },
    res => {
      this.toastService.danger(`${res.error.message}`);
    })
  }

  demoteOwners(users: User[]): void {
    if (users.map(user => user.id).includes(this.currentUser.id)) {
      this.promptService.confirm("Do you really want to remove yourself as an owner from the project?").then(() => {
        this.executeDemoteOwners(users, true);
      })
    } else {
      this.executeDemoteOwners(users, false);
    }
  }

  private executeDemoteOwners(users: User[], redirect: boolean): void {
    this.projectApi.addMembers(this.appStore.project.id, users.map(user => user.id)).subscribe(() => {
      this.members.next([...this.members.value, ...users]);
      this.owners.next(this.owners.value.filter(owner => !users.includes(owner)));
      this.appStore.reloadProject();
      if (redirect) {
        this.router.navigate(['/app', 'projects', this.appStore.project.id])
      }
    },
    res => {
      this.toastService.danger(`${res.error.message}`);
    })
  }
}
