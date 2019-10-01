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

import { remove } from 'lodash';
import { events } from '../../../constants';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolGroup } from '../../../entities/symbol-group';
import { Selectable } from '../../../utils/selectable';
import { SymbolGroupUtils } from '../../../utils/symbol-group-utils';
import { IScope } from 'angular';
import { SymbolResource } from '../../../services/resources/symbol-resource.service';
import { SymbolGroupApiService } from '../../../services/resources/symbol-group-api.service';
import { ToastService } from '../../../services/toast.service';
import { EventBus } from '../../../services/eventbus.service';
import { PromptService } from '../../../services/prompt.service';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The controller that handles CRUD operations on symbols and symbol groups.
 */
class SymbolsViewComponent {

  /** The model for selected symbols. */
  public selectedSymbols: Selectable<AlphabetSymbol>;

  /** The symbol groups that belong to the project. */
  public groups: SymbolGroup[];

  /** The symbols in the groups. */
  public symbols: AlphabetSymbol[];

  /* @ngInject */
  constructor(private $scope: IScope,
              private appStore: AppStoreService,
              private symbolResource: SymbolResource,
              private symbolGroupApi: SymbolGroupApiService,
              private toastService: ToastService,
              private eventBus: EventBus,
              private promptService: PromptService,
              private $state: any,
              private $uibModal: any) {

    this.selectedSymbols = null;
    this.groups = [];
    this.symbols = [];

    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => {
        this.groups = groups;
        this.symbols = SymbolGroupUtils.getSymbols(this.groups);
        this.selectedSymbols = new Selectable(this.symbols, 'id');
      },
      console.error
    );

    this.eventBus.on(events.GROUP_UPDATED, (evt, data) => {
      this.updateGroup(data.group);
    }, $scope);

    this.eventBus.on(events.GROUP_DELETED, (evt, data) => {
      this.deleteGroup(data.group);
    }, $scope);

    this.eventBus.on(events.SYMBOL_UPDATED, (evt, data) => {
      this.updateSymbol(data.symbol);
    }, $scope);

    this.eventBus.on(events.SYMBOLS_MOVED, (evt, data) => {
      this.moveSymbolsToGroup(data.symbols, data.group);
    }, $scope);

    this.eventBus.on(events.GROUP_MOVED, (evt, data) => {
      this.moveGroup(data.from, data.group);
    });
  }

  /**
   * Adds a single new symbol to the scope by finding its corresponding group and adding it there.
   *
   * @param symbol The symbol that should be added.
   */
  addSymbol(symbol: AlphabetSymbol): void {
    const group = SymbolGroupUtils.findGroupById(this.groups, symbol.group);
    group.symbols.push(symbol);
    this.symbols.push(symbol);
  }

  /**
   * Adds multiple new symbols to the scope.
   *
   * @param symbols
   */
  addSymbols(symbols: AlphabetSymbol[]): void {
    symbols.forEach(s => this.addSymbol(s));
  }

  /**
   * Removes a list of symbols from the scope by finding the group of each symbol and removing it from
   * it.
   *
   * @param symbols The symbols that should be removed.
   */
  removeSymbols(symbols: AlphabetSymbol[]): void {
    symbols.forEach(symbol => {
      const group = SymbolGroupUtils.findGroupById(this.groups, symbol.group);
      remove(group.symbols, {id: symbol.id});
      remove(this.symbols, {id: symbol.id});
      this.selectedSymbols.unselect(symbol);
    });
  }

  /**
   * Updates an existing symbol.
   *
   * @param updatedSymbol The updated symbol object.
   */
  updateSymbol(updatedSymbol: AlphabetSymbol): void {
    this.updateSymbols([updatedSymbol]);
  }

  /**
   * Updates multiple existing symbols.
   *
   * @param updatedSymbols The updated symbol objects.
   */
  updateSymbols(updatedSymbols: AlphabetSymbol[]): void {
    updatedSymbols.forEach(symbol => {
      const group = SymbolGroupUtils.findGroupById(this.groups, symbol.group);
      const i = group.symbols.findIndex(s => s.id === symbol.id);
      if (i > -1) {
        group.symbols[i].name = symbol.name;
        group.symbols[i].description = symbol.description;
        group.symbols[i].expectedResult = symbol.expectedResult;
        group.symbols[i].group = symbol.group;
      }
    });
  }

  editSelectedSymbol(): void {
    const selectedSymbols = this.selectedSymbols.getSelected();
    if (selectedSymbols.length === 1) {
      this.$uibModal.open({
        component: 'symbolEditModal',
        resolve: {
          symbol: () => new AlphabetSymbol(JSON.parse(JSON.stringify(selectedSymbols[0])))
        }
      });
    }
  }

  /**
   * Moves a list of existing symbols into another group.
   *
   * @param symbols The symbols that should be moved.
   * @param group The group the symbols should be moved into.
   */
  moveSymbolsToGroup(symbols: AlphabetSymbol[], group: SymbolGroup): void {
    const toGroup = SymbolGroupUtils.findGroupById(this.groups, group.id);

    symbols.forEach(symbol => {
      const g = SymbolGroupUtils.findGroupById(this.groups, symbol.group);
      const i = g.symbols.findIndex(s => s.id === symbol.id);
      g.symbols.splice(i, 1);
      symbol.group = group.id;
      toGroup.symbols.push(symbol);
    });

    this.selectedSymbols.unselectAll();
  }

  /**
   * Deletes all symbols that the user selected from the server and the scope, if the deletion was successful.
   */
  deleteSelectedSymbols(): void {
    const selectedSymbols = this.selectedSymbols.getSelected();
    if (selectedSymbols.length > 0) {
      this.symbolResource.removeMany(selectedSymbols)
        .then(() => {
          this.toastService.success('Symbols deleted');
          this.removeSymbols(selectedSymbols);
        })
        .catch(err => {
          this.toastService.danger('<p><strong>Deleting symbols failed</strong></p>' + err.data.message);
        });
    }
  }

  /**
   * Adds a new group to the list.
   *
   * @param createdGroup The created group.
   */
  addGroup(createdGroup: SymbolGroup): void {
    if (createdGroup.parent == null) {
      this.groups.push(createdGroup);
    } else {
      const g = SymbolGroupUtils.findGroupById(this.groups, createdGroup.parent);
      g.groups.push(createdGroup);
    }
  }

  /**
   * Updates a symbol group in the scope by changing its name property to the one of the groups that is passed
   * as a parameter.
   *
   * @param updatedGroup The updated symbol group.
   */
  updateGroup(updatedGroup: SymbolGroup): void {
    let group = null;
    if (updatedGroup.parent == null) {
      group = this.groups.find(g => g.id === updatedGroup.id);
    } else {
      group = SymbolGroupUtils.findGroupById(this.groups, updatedGroup.id);
    }
    group.name = updatedGroup.name;
  }

  /**
   * Removes a symbol group from the scope and also removes its symbols.
   *
   * @param group - The group to delete.
   */
  deleteGroup(group: SymbolGroup): void {
    this.removeSymbols(group.symbols);
    if (group.parent == null) {
      remove(this.groups, {id: group.id});
    } else {
      const g = SymbolGroupUtils.findGroupById(this.groups, group.parent);
      remove(g.groups, {id: group.id});
    }
  }

  moveGroup(from: number, group: SymbolGroup): void {
    if (from == null && group.parent != null) {
      remove(this.groups, {id: group.id});
      SymbolGroupUtils.findGroupById(this.groups, group.parent).groups.push(group);
    } else if (from != null && group.parent == null) {
      const oldGroup = SymbolGroupUtils.findGroupById(this.groups, from);
      remove(oldGroup.groups, {id: group.id});
      this.groups.push(group);
    } else if (from != null && group.parent != null) {
      const oldGroup = SymbolGroupUtils.findGroupById(this.groups, from);
      remove(oldGroup.groups, {id: group.id});
      SymbolGroupUtils.findGroupById(this.groups, group.parent).groups.push(group);
    }
  }

  moveSelectedSymbols(): void {
    const selectedSymbols = this.selectedSymbols.getSelected();
    if (selectedSymbols.length > 0) {
      this.$uibModal.open({
        component: 'symbolMoveModal',
        resolve: {
          symbols: () => selectedSymbols
        }
      });
    }
  }

  importSymbols(): void {
    this.$uibModal.open({
      component: 'symbolsImportModal',
      resolve: {
        groups: () => this.groups
      }
    }).result.then(data => {
      if (data.type === 'symbols') {
        this.addSymbols(data.symbols);
      } else {
        data.groups.forEach(g => this.addGroup(g));
      }
    });
  }

  selectSymbol(symbol: AlphabetSymbol): void {
    this.$state.go('symbol', {projectId: this.project.id, symbolId: symbol.id});
  }

  /**
   * Deletes all properties that are not needed for downloading symbols which are the id, project, group
   * and hidden properties. They are removed so that they can later be uploaded and created like new symbols.
   */
  exportSelectedSymbols(): void {
    if (this.selectedSymbols.getSelected().length > 0) {
      this.$uibModal.open({
        component: 'symbolsExportModal',
        resolve: {
          groups: () => this.groups,
          selectedSymbols: () => this.selectedSymbols
        }
      });
    } else {
      this.toastService.info('You have to select at least one symbol.');
    }
  }

  openSymbolCreateModal(): void {
    this.$uibModal.open({
      component: 'symbolCreateModal',
      resolve: {
        groups: () => this.groups,
        onCreated: () => (s) => this.addSymbol(s)
      }
    });
  }

  openSymbolGroupCreateModal(): void {
    this.$uibModal.open({
      component: 'symbolGroupCreateModal'
    }).result.then((group: SymbolGroup) => this.addGroup(group));
  }

  get project(): Project {
    return this.appStore.project;
  }
}

export const symbolsViewComponent = {
  controller: SymbolsViewComponent,
  controllerAs: 'vm',
  template: require('html-loader!./symbols-view.component.html')
};
