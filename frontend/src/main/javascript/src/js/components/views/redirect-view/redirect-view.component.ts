/*
 * Copyright 2018 TU Dortmund
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

import {ILocationService} from 'angular';
import {UserService} from '../../../services/user.service';
import {User} from '../../../entities/user';

export const redirectViewComponent = {
  template: require('./redirect-view.component.html'),
  controllerAs: 'vm',
  controller: class RedirectViewComponent {

    public targetUrl: string;

    /**
     * Constructor.
     *
     * @param $state
     * @param $stateParams
     * @param $location
     * @param userService
     */
    // @ngInject
    constructor(private $state: any,
                private $stateParams: any,
                private $location: ILocationService,
                private userService: UserService) {

      if (this.$stateParams.to == null) {
        this.$state.go('error', {message: 'You did not specify a target URL.'});
        return;
      }

      this.targetUrl = this.$stateParams.to;

      const matchingStates = this.$state.get().filter(s => s.$$state().url.exec(this.targetUrl));
      if (matchingStates.length === 0) {
        this.$state.go('error', {message: 'The URL that you want to go to can not be found.'});
        return;
      }

      if (this.currentUser != null) {
        this.redirect();
      }
    }

    redirect(): void {
      this.$location.url(this.targetUrl);
    }

    get currentUser(): User {
      return this.userService.store.currentUser;
    }
  }
};
