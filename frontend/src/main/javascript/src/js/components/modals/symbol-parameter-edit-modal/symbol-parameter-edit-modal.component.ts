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

import {ModalComponent} from '../modal.component';
import {SymbolParameterResource} from '../../../services/resources/symbol-parameter-resource.service';
import {IFormController} from 'angular';

export const symbolParameterEditModalComponent = {
  template: require('./symbol-parameter-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SymbolParameterEditModalComponent extends ModalComponent {

    /** The error message. */
    public errorMessage: string = null;

    /** The form. */
    public form: IFormController = null;

    /** The parameter under edit. */
    public parameter: any = null;

    /**
     * Constructor.
     *
     * @param symbolParameterResource
     */
    // @ngInject
    constructor(private symbolParameterResource: SymbolParameterResource) {
      super();
    }

    $onInit(): void {
      this.parameter = this.resolve.parameter;
    }

    update(): void {
      this.errorMessage = null;

      const symbol = this.resolve.symbol;
      this.symbolParameterResource.update(symbol.project, symbol.id, this.parameter)
        .then(param => this.close({$value: param}))
        .catch(err => this.errorMessage = err.data.message);
    }
  }
};
