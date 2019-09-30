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

import { remove } from 'lodash';
import { User } from '../../../entities/user';
import { Selectable } from '../../../utils/selectable';
import { IScope } from 'angular';
import { UserResource } from '../../../services/resources/user-resource.service';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';

/**
 * The controller for the admin users page.
 */
export const adminUsersViewComponent = {
  template: require('html-loader!./admin-users-view.component.html'),
  controllerAs: 'vm',
  controller: class AdminUsersViewComponent {

    /** All registered users. */
    public users: User[];

    /** All selected users. */
    public selectedUsers: Selectable<User>;

    /**
     * Constructor.
     *
     * @param $scope
     * @param userResource
     * @param toastService
     * @param $uibModal
     * @param userService
     */
    /* @ngInject */
    constructor(private $scope: IScope,
                private userResource: UserResource,
                private toastService: ToastService,
                private $uibModal: any,
                private userService: UserService) {

      this.users = [];
      this.selectedUsers = new Selectable(this.users, 'id');

      // fetch all users from the server
      this.userResource.getAll()
        .then(users => {
          this.users = users;
          this.selectedUsers = new Selectable(this.users, 'id');
        })
        .catch(err => {
          this.toastService.danger(`Loading users failed! ${err.data.message}`);
        });
    }

    /**
     * Removes a user from the list.
     *
     * @param user
     */
    removeUser(user: User): void {
      remove(this.users, {id: user.id});
    }

    updateUser(user: User): void {
      const i = this.users.findIndex(u => u.id === user.id);
      this.users[i] = user;
      this.selectedUsers.update(user);
    }

    createUser(): void {
      this.$uibModal.open({
        component: 'userCreateModal',
      }).result.then(createdUser => this.users.push(createdUser));
    }

    /**
     * Updates a user in the list.
     *
     * @param user
     */
    editUser(user: User): void {
      this.$uibModal.open({
        component: 'userEditModal',
        resolve: {
          user: () => user.copy(),
          onUpdated: () => (u) => this.updateUser(u),
          onDeleted: () => (u) => this.removeUser(u)
        }
      });
    }

    /**
     * Deletes selected users which are not admins.
     */
    deleteSelectedUsers(): void {
      const users = this.selectedUsers.getSelected().filter(u => u.id !== this.user.id);
      if (users.length === 0) {
        this.toastService.info('You have to select at least one user.');
        return;
      }

      const ids = users.map(u => u.id);
      this.userResource.removeManyUsers(ids)
        .then(() => {
          this.toastService.success('The users have been deleted');
          users.forEach(user => this.removeUser(user));
        })
        .catch(err => {
          this.toastService.danger(`Deleting failed! ${err.data.message}`);
        });
    }

    get user(): User {
      return this.userService.store.currentUser;
    }
  }
};
