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

import { ActionService } from '../../../services/action.service';
import { SymbolApiService } from '../../../services/api/symbol-api.service';
import { Project } from '../../../entities/project';
import { Action } from '../../../entities/actions/action';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { AppStoreService } from '../../../services/app-store.service';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * The component for the modal dialog that handles the editing of an action.
 */
@Component({
  selector: 'edit-action-modal',
  templateUrl: './edit-action-modal.component.html'
})
export class EditActionModalComponent {

  /** The action under edit. */
  @Input()
  action: Action;



  /** All symbols. */
  symbols: AlphabetSymbol[];

  constructor(private actionService: ActionService,
              private symbolApi: SymbolApiService,
              private appStore: AppStoreService,
              public modal: NgbActiveModal) {
    this.symbols = [];

    // fetch all symbols so that symbols have access to it
    const project: Project = this.appStore.project;
    this.symbolApi.getAll(project.id).subscribe(
      symbols => this.symbols = symbols
    );
  }

  /** Close the modal dialog and pass the updated action to the handle that called it. */
  updateAction(): void {
    this.modal.close(this.action);
  }
}
