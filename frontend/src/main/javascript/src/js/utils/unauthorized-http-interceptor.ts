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

import {ToastService} from '../services/toast.service';
import {UserService} from '../services/user.service';
import {IQService} from 'angular';
import IInjectorService = angular.auto.IInjectorService;

/**
 * Intercept HTTP responses and redirect to the start page if the user is unauthorized (status 401).
 *
 * @param $q
 * @param $injector
 * @param $state
 */

/* @ngInject */
export function unauthorizedHttpInterceptor($q: IQService, $injector: IInjectorService, $state: any) {
  return {
    responseError: function (rejection) {
      if (rejection.status === 401) {
        const toastService: ToastService = $injector.get('toastService');
        toastService.danger('You are currently not authorized to view this page.');

        const userService: UserService = $injector.get('userService');
        userService.logout();

        $state.go('root');
        return $q.reject(rejection);
      } else {
        return rejection;
      }
    }
  };
}