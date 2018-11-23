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

import * as remove from 'lodash/remove';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {Selectable} from '../../../utils/selectable';
import {ProjectService} from '../../../services/project.service';
import {SymbolResource} from '../../../services/resources/symbol-resource.service';
import {ToastService} from '../../../services/toast.service';
import {Project} from '../../../entities/project';

/**
 * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
 * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
 */
class SymbolsArchiveViewComponent {

  /** The list of archived symbols. */
  public symbols: AlphabetSymbol[];

  /** The selected symbols. */
  public selectedSymbols: Selectable<AlphabetSymbol>;

  /**
   * Constructor.
   *
   * @param projectService
   * @param symbolResource
   * @param toastService
   * @param $uibModal
   */
  /* @ngInject */
  constructor(private projectService: ProjectService,
              private symbolResource: SymbolResource,
              private toastService: ToastService,
              private $uibModal: any) {

    this.symbols = [];
    this.selectedSymbols = new Selectable(this.symbols, 'id');

    // fetch all deleted symbols and save them in scope
    this.symbolResource.getAll(this.project.id, true)
      .then(symbols => {
        this.symbols = symbols;
        this.selectedSymbols = new Selectable(this.symbols, 'id');
      })
      .catch(err => this.toastService.danger(`Could not get symbols. ${err.data.message}`));
  }

  /**
   * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success.
   *
   * @param symbol The symbol that should be recovered from the trash.
   */
  recoverSymbol(symbol: AlphabetSymbol): void {
    this.symbolResource.recover(symbol)
      .then(() => {
        this.toastService.success('Symbol ' + symbol.name + ' recovered');
        this.selectedSymbols.unselect(symbol);
        remove(this.symbols, {id: symbol.id});
      })
      .catch(err => {
        this.toastService.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + err.data.message);
      });
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

    this.symbolResource.recoverMany(selectedSymbols)
      .then(() => {
        this.toastService.success('Symbols recovered');
        selectedSymbols.forEach(symbol => remove(this.symbols, {id: symbol.id}));
        this.selectedSymbols.unselectAll();
      })
      .catch(err => {
        this.toastService.danger('<p><strong>Error recovering symbols!</strong></p>' + err.data.message);
      });
  }

  /**
   * Edits the symbol.
   *
   * @param symbol The symbol to edit.
   */
  editSymbol(symbol: AlphabetSymbol): void {
    this.$uibModal.open({
      component: 'symbolEditModal',
      resolve: {
        symbol: () => new AlphabetSymbol(JSON.parse(JSON.stringify(symbol))),
      }
    }).result.then(updatedSymbol => {
      const i = this.symbols.findIndex(s => s.id === updatedSymbol.id);
      this.symbols[i].name = updatedSymbol.name;
    });
  }

  deleteSymbol(symbol: AlphabetSymbol): void {
    this.symbolResource.delete(symbol)
      .then(() => {
        this.toastService.success('The symbol has been deleted permanently.');
        this.selectedSymbols.unselect(symbol);
        remove(this.symbols, {id: symbol.id});
      })
      .catch(err => this.toastService.danger(`The symbol could be deleted permanently. ${err.data.message}`));
  }

  deleteSelectedSymbols(): void {
    const symbols = this.selectedSymbols.getSelected();
    if (this.selectedSymbols.getSelected().length === 0) {
      this.toastService.info('You have to select at least one symbol.');
      return;
    }

    this.symbolResource.deleteMany(this.project.id, symbols)
      .then(() => {
        this.toastService.success('The symbols have been deleted.');
        this.selectedSymbols.unselectAll();
        symbols.forEach(s1 => remove(this.symbols, s2 => s2.id === s1.id));
      })
      .catch(err => {
        this.toastService.danger(`The symbols could not be deleted. ${err.data.message}`)
      });
  }

  get project(): Project {
    return this.projectService.store.currentProject;
  }
}

export const symbolsArchiveViewComponent = {
  controller: SymbolsArchiveViewComponent,
  controllerAs: 'vm',
  template: require('./symbols-archive-view.component.html')
};
