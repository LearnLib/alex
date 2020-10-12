/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { orderBy, remove } from 'lodash';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { Selectable } from '../../utils/selectable';
import { SymbolApiService } from '../../services/api/symbol-api.service';
import { ToastService } from '../../services/toast.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { EditSymbolModalComponent } from '../symbols-view/edit-symbol-modal/edit-symbol-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { SymbolUsagesModalComponent } from '../../common/modals/symbol-usages-modal/symbol-usages-modal.component';

/**
 * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
 * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
 */
@Component({
  selector: 'symbols-archive-view',
  templateUrl: './symbols-archive-view.component.html'
})
export class SymbolsArchiveViewComponent implements OnInit {

  /** The list of archived symbols. */
  public symbols: AlphabetSymbol[];

  /** The selected symbols. */
  public selectedSymbols: Selectable<AlphabetSymbol, number>;

  constructor(private appStore: AppStoreService,
              private symbolApi: SymbolApiService,
              private toastService: ToastService,
              private modalService: NgbModal) {

    this.symbols = [];
    this.selectedSymbols = new Selectable<AlphabetSymbol, number>(s => s.id);
  }

  get project(): Project {
    return this.appStore.project;
  }

  get orderedSymbols(): AlphabetSymbol[] {
    return orderBy(this.symbols, ['name']);
  }

  ngOnInit(): void {
    this.symbolApi.getAll(this.project.id).subscribe(
      symbols => {
        this.symbols = symbols.filter(s => s.hidden);
        this.selectedSymbols.addItems(this.symbols);
      },
      res => this.toastService.danger(`Could not get symbols. ${res.error.message}`)
    );
  }

  /**
   * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success.
   *
   * @param symbol The symbol that should be recovered from the trash.
   */
  recoverSymbol(symbol: AlphabetSymbol): void {
    this.symbolApi.recover(symbol).subscribe(
      () => {
        this.toastService.success('Symbol ' + symbol.name + ' recovered');
        this.selectedSymbols.remove(symbol);
        remove(this.symbols, {id: symbol.id});
      },
      res => {
        this.toastService.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + res.error.message);
      }
    );
  }

  /**
   * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one.
   */
  recoverSelectedSymbols(): void {
    const selectedSymbols = this.selectedSymbols.getSelected();
    if (selectedSymbols.length === 0) {
      this.toastService.info('You have to select at least one symbol.');
      return;
    }

    this.symbolApi.recoverMany(selectedSymbols).subscribe(
      () => {
        this.toastService.success('Symbols recovered');
        selectedSymbols.forEach(symbol => remove(this.symbols, {id: symbol.id}));
        this.selectedSymbols.removeMany(selectedSymbols);
      },
      res => {
        this.toastService.danger('<p><strong>Error recovering symbols!</strong></p>' + res.error.message);
      }
    );
  }

  showUsages(symbol: AlphabetSymbol): void {
    const modalRef = this.modalService.open(SymbolUsagesModalComponent);
    modalRef.componentInstance.symbol = symbol;
  }

  /**
   * Edits the symbol.
   *
   * @param symbol The symbol to edit.
   */
  editSymbol(symbol: AlphabetSymbol): void {
    const modalRef = this.modalService.open(EditSymbolModalComponent);
    modalRef.componentInstance.symbol = new AlphabetSymbol(JSON.parse(JSON.stringify(symbol)));
    modalRef.result.then((updatedSymbol: AlphabetSymbol) => {
      const i = this.symbols.findIndex(s => s.id === updatedSymbol.id);
      this.symbols[i].name = updatedSymbol.name;
    }).catch(() => {
    });
  }

  deleteSymbol(symbol: AlphabetSymbol): void {
    this.symbolApi.delete(symbol).subscribe(
      () => {
        this.toastService.success('The symbol has been deleted permanently.');
        this.selectedSymbols.remove(symbol);
        remove(this.symbols, {id: symbol.id});
      },
      res => this.toastService.danger(`The symbol could be deleted permanently. ${res.error.message}`)
    );
  }

  deleteSelectedSymbols(): void {
    const symbols = this.selectedSymbols.getSelected();
    if (this.selectedSymbols.getSelected().length === 0) {
      this.toastService.info('You have to select at least one symbol.');
      return;
    }

    this.symbolApi.deleteMany(this.project.id, symbols).subscribe(
      () => {
        this.toastService.success('The symbols have been deleted.');
        this.selectedSymbols.removeMany(symbols);
        symbols.forEach(s1 => remove(this.symbols, s2 => s2.id === s1.id));
      },
      res => {
        this.toastService.danger(`The symbols could not be deleted. ${res.error.message}`)
      }
    );
  }
}
