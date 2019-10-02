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

import { ToastService } from '../../../services/toast.service';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The component for the logout view.
 */
export const logoutViewComponent = {
  template: require('html-loader!./logout-view.component.html'),
  controllerAs: 'vm',
  controller: class LogoutViewComponent {

    /* @ngInject */
    constructor(private appStore: AppStoreService,
                private toastService: ToastService,
                private $state: any) {
    }

    $onInit() {
      this.appStore.logout();
      this.toastService.success('You have been logged out.');
      this.$state.go('root');
    }
  }
};
