/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { Project } from '../../../entities/project';
import { SymbolGroup } from '../../../entities/symbol-group';
import { SymbolApiService } from '../../../services/api/symbol-api.service';
import { ToastService } from '../../../services/toast.service';
import { AppStoreService } from '../../../services/app-store.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * The controller for the modal window to create a new symbol.
 */
@Component({
  selector: 'create-symbol-modal',
  templateUrl: './create-symbol-modal.component.html'
})
export class CreateSymbolModalComponent implements OnInit {

  @Output()
  created = new EventEmitter<AlphabetSymbol>();

  /** The list of available symbol groups where the new symbol could be created in. */
  @Input()
  groups: SymbolGroup[];

  symbol = new AlphabetSymbol();

  /** An error message that can be displayed in the template. */
  errorMessage: string;

  /** The selected symbol group. */
  selectedSymbolGroup: SymbolGroup;

  /** The form. */
  form = new FormGroup({});

  constructor(private symbolApi: SymbolApiService,
              private toastService: ToastService,
              private appStore: AppStoreService,
              public modal: NgbActiveModal) {
    this.groups = [];
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.selectedSymbolGroup = this.getDefaultGroup();
  }

  /**
   * Creates a new symbol but does not close the modal window.
   *
   * @returns
   */
  createSymbolAndContinue(): void {
    this.errorMessage = null;
    this._createSymbol().subscribe(
      () => {
      },
      response => this.errorMessage = response.error.message
    );
  }

  /**
   * Makes a request to the API and create a new symbol. If the name of the group the user entered was not found
   * the symbol will be put in the default group with the id 0. Closes the modal on success.
   */
  createSymbol(): void {
    this._createSymbol().subscribe(
      () => this.modal.dismiss(),
      response => this.errorMessage = response.error.message
    );
  }

  selectSymbolGroup(group: SymbolGroup): void {
    if (this.selectedSymbolGroup != null && this.selectedSymbolGroup.id === group.id) {
      this.selectedSymbolGroup = this.getDefaultGroup();
    } else {
      this.selectedSymbolGroup = group;
    }
  }

  private getDefaultGroup(): SymbolGroup {
    return this.groups.reduce((acc, curr) => curr.id < acc.id ? curr : acc);
  }

  private _createSymbol(): Observable<AlphabetSymbol> {
    const symbol = new AlphabetSymbol();
    symbol.group = this.selectedSymbolGroup.id;
    symbol.name = this.form.controls.name.value;
    symbol.description = this.form.controls.description.value;
    symbol.expectedResult = this.form.controls.expectedResult.value;

    return this.symbolApi.create(this.project.id, symbol).pipe(
      tap((s: AlphabetSymbol) => {
        this.toastService.success(`Created symbol "${s.name}"`);
        this.created.emit(s);
        this.form.reset();
      })
    );
  }
}
