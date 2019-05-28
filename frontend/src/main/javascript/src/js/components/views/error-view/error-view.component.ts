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

/**
 * The component of the error page.
 */
export const errorViewComponent = {
  template: require('./error-view.component.html'),
  controllerAs: 'vm',
  controller: class ErrorViewComponent {

    /** The error message. */
    public message: string;

    /**
     * Constructor.
     *
     * @param $stateParams
     */
    /* @ngInject */
    constructor(private $stateParams: any) {
      this.message = null;
    }

    $onInit() {
      const message = this.$stateParams.message;
      if (message !== null) {
        this.message = message;
      }
    }
  }
};
