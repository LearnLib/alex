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

import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolApiService } from '../../../services/api/symbol-api.service';
import { ToastService } from '../../../services/toast.service';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

/**
 * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
 */
@Component({
  selector: 'edit-symbol-modal',
  templateUrl: './edit-symbol-modal.component.html'
})
export class EditSymbolModalComponent {

  /** The symbol to edit. */
  @Input()
  symbol: AlphabetSymbol;

  /** The error message that is displayed when update fails. */
  errorMessage: string = null;

  /** The form. */
  form = new FormGroup({});

  constructor(private symbolApi: SymbolApiService,
              private toastService: ToastService,
              public modal: NgbActiveModal) {
  }

  /**
   * Make a request to the API in order to update the symbol. Close the modal on success.
   */
  updateSymbol(): void {
    this.errorMessage = null;

    this.symbol.name = this.form.controls.name.value;
    this.symbol.description = this.form.controls.description.value;
    this.symbol.expectedResult = this.form.controls.expectedResult.value;

    // update the symbol and close the modal dialog on success with the updated symbol
    this.symbolApi.update(this.symbol.toJson()).subscribe(
      updatedSymbol => {
        this.toastService.success('Symbol updated');
        this.modal.close(updatedSymbol);
      },
      res => {
        this.errorMessage = res.error.message;
      }
    );
  }
}
