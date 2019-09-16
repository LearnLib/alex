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

import { ModalComponent } from '../modal.component';

export const executionResultModalComponent = {
  template: require('./execution-result-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class ExecutionResultModalComponent extends ModalComponent {

    public result: any;
    public formattedTrace: any[];

    /* @ngInject */
    constructor() {
      super();
      this.formattedTrace = [];
    }

    $onInit() {
      this.result = this.resolve.result;
      if (this.result.trace !== '') {
        const trace = this.result.trace;
        this.formattedTrace = trace.substr(1, trace.length - 2).split('] > [').map(p => {
          const parts = p.split(' / ');
          return {symbol: parts.shift(), output: parts.join(' / ')}
        });
      }
    }
  }
};