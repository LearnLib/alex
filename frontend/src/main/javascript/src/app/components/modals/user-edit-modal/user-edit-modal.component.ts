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

import { userRole } from '../../../constants';
import { User } from '../../../entities/user';
import { ModalComponent } from '../modal.component';
import { UserApiService } from '../../../services/resources/user-api.service';
import { ToastService } from '../../../services/toast.service';
import { PromptService } from '../../../services/prompt.service';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The component for the modal window that handles editing a user.
 * This should only be called by an admin.
 */
export const userEditModalComponent = {
  template: require('html-loader!./user-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class UserEditModalComponent extends ModalComponent {

    /** Available user roles. */
    public userRole: any = userRole;

    /** The error message to display. */
    public error: string = null;

    /** The user under edit. */
    public user: User = null;

    /** The email of the user. */
    public email: string = null;

    /* @ngInject */
    constructor(private $state: any,
                private userApi: UserApiService,
                private toastService: ToastService,
                private promptService: PromptService,
                private appStore: AppStoreService) {
      super();
    }

    $onInit(): void {
      this.user = this.resolve.user;
      this.email = this.user.email;
    }

    /**
     * Changes the EMail of an user.
     */
    changeEmail(): void {
      this.error = null;
      this.userApi.changeEmail(this.user, this.email).subscribe(
        user => {
          if (this.currentUser.id === this.user.id) {
            this.appStore.login(user);
          }

          this.resolve.onUpdated(user);
          this.dismiss();
          this.toastService.success('The email has been changed.');
        },
        response => {
          this.error = response.data.message;
        }
      );
    }

    /**
     * Gives a user admin rights.
     */
    promoteUser(): void {
      this.error = null;
      this.userApi.promote(this.user).subscribe(
        user => {
          this.toastService.success('The user now has admin rights.');
          this.resolve.onUpdated(user);
          this.dismiss();
        },
        response => {
          this.error = response.data.message;
        }
      );
    }

    /**
     * Removes the admin rights of a user. If an admin removes his own rights
     * he will be logged out automatically.
     */
    demoteUser(): void {
      this.error = null;
      this.userApi.demote(this.user).subscribe(
        user => {
          if (this.currentUser.id === this.user.id) {
            this.appStore.logout();
            this.$state.go('root');
          } else {
            this.resolve.onUpdated(user);
          }
          this.dismiss();
          this.toastService.success('The user now has default user rights.');
        },
        response => {
          this.error = response.data.message;
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
              this.resolve.onDeleted(this.user);
              this.dismiss();
            },
            response => {
              this.error = response.data.message;
            }
          );
        });
    }

    get currentUser(): User {
      return this.appStore.user;
    }
  },
};
