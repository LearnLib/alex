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

import { IRootScopeService, IScope } from 'angular';

/**
 * The event bus.
 */
export class EventBus {

  /**
   * Constructor.
   *
   * @param $rootScope
   */
  /* @ngInject */
  constructor(private $rootScope: IRootScopeService) {
  }

  /**
   * Listen on an event with automatic event destructor.
   *
   * @param eventName The event to emit.
   * @param fn The callback function.
   * @param scope The related scope.
   */
  on(eventName: string, fn, scope: IScope = null): void {
    const off = this.$rootScope.$on(eventName, fn);
    if (scope !== null) scope.$on('$destroy', off);
  }

  /**
   * Emits an event on the rootScope.
   *
   * @param eventName The eventName.
   * @param data The data to pass.
   */
  emit(eventName: string, data: any): void {
    this.$rootScope.$emit(eventName, data);
  }
}
