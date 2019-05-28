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

import {events} from '../../../constants';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {ModalComponent} from '../modal.component';
import {SymbolResource} from '../../../services/resources/symbol-resource.service';
import {ToastService} from '../../../services/toast.service';
import {EventBus} from '../../../services/eventbus.service';

/**
 * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
 */
export const symbolEditModalComponent = {
  template: require('./symbol-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SymbolEditModalComponent extends ModalComponent {

    /** The symbol to edit. */
    public symbol: AlphabetSymbol = null;

    /** The error message that is displayed when update fails. */
    public errorMsg: string = null;

    /**
     * Constructor.
     *
     * @param symbolResource
     * @param toastService
     * @param eventBus
     */
    /* @ngInject */
    constructor(private symbolResource: SymbolResource,
                private toastService: ToastService,
                private eventBus: EventBus) {
      super();
    }

    $onInit(): void {
      this.symbol = this.resolve.symbol;
    }

    /**
     * Make a request to the API in order to update the symbol. Close the modal on success.
     */
    updateSymbol(): void {
      this.errorMsg = null;

      // update the symbol and close the modal dialog on success with the updated symbol
      this.symbolResource.update(this.symbol.toJson())
        .then((updatedSymbol: AlphabetSymbol) => {
          this.toastService.success('Symbol updated');
          this.eventBus.emit(events.SYMBOL_UPDATED, {symbol: updatedSymbol});
          this.close({$value: updatedSymbol});
        })
        .catch(err => {
          this.errorMsg = err.data.message;
        });
    }
  }
};
