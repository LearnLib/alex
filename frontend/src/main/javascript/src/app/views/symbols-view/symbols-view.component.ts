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
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { SymbolGroup } from '../../entities/symbol-group';
import { Selectable } from '../../utils/selectable';
import { SymbolGroupUtils } from '../../utils/symbol-group-utils';
import { SymbolApiService } from '../../services/resources/symbol-api.service';
import { SymbolGroupApiService } from '../../services/resources/symbol-group-api.service';
import { ToastService } from '../../services/toast.service';
import { EventBus } from '../../services/eventbus.service';
import { PromptService } from '../../services/prompt.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSymbolGroupModalComponent } from './create-symbol-group-modal/create-symbol-group-modal.component';
import { EditSymbolModalComponent } from './edit-symbol-modal/edit-symbol-modal.component';
import { MoveSymbolsModalComponent } from './move-symbols-modal/move-symbols-modal.component';
import { CreateSymbolModalComponent } from './create-symbol-modal/create-symbol-modal.component';
import { ImportSymbolsModalComponent } from './import-symbols-modal/import-symbols-modal.component';
import { ExportSymbolsModalComponent } from './export-symbols-modal/export-symbols-modal.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The controller that handles CRUD operations on symbols and symbol groups.
 */
@Component({
  selector: 'symbols-view',
  templateUrl: './symbols-view.component.html'
})
export class SymbolsViewComponent implements OnInit {

  /** The model for selected symbols. */
  public selectedSymbols: Selectable<AlphabetSymbol>;

  /** The symbol groups that belong to the project. */
  public groups: SymbolGroup[];

  /** The symbols in the groups. */
  public symbols: AlphabetSymbol[];

  constructor(private appStore: AppStoreService,
              private symbolApi: SymbolApiService,
              private symbolGroupApi: SymbolGroupApiService,
              private toastService: ToastService,
              private eventBus: EventBus,
              private promptService: PromptService,
              private modalService: NgbModal,
              private router: Router) {

    this.selectedSymbols = null;
    this.groups = [];
    this.symbols = [];

    this.eventBus.groupUpdated$.subscribe(group => {
      this.updateGroup(group);
    });

    this.eventBus.groupDeleted$.subscribe((group) => {
      this.deleteGroup(group);
    });

    this.eventBus.symbolUpdated$.subscribe(symbol => {
      this.updateSymbol(symbol);
    });

    this.eventBus.symbolsMoved$.subscribe(data => {
      this.moveSymbolsToGroup(data.symbols, data.group);
    });

    this.eventBus.groupMoved$.subscribe(data => {
      this.moveGroup(data.from, data.group);
    });
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.symbolGroupApi.getAll(this.project.id).subscribe(
      groups => {
        this.groups = groups;
        this.symbols = SymbolGroupUtils.getSymbols(this.groups);
        this.selectedSymbols = new Selectable(this.symbols, 'id');
      },
      console.error
    );
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
      const modalRef = this.modalService.open(EditSymbolModalComponent);
      modalRef.componentInstance.symbol = new AlphabetSymbol(JSON.parse(JSON.stringify(selectedSymbols[0])));
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
      this.symbolApi.removeMany(selectedSymbols).subscribe(
        () => {
          this.toastService.success('Symbols deleted');
          this.removeSymbols(selectedSymbols);
        },
        err => {
          this.toastService.danger('<p><strong>Deleting symbols failed</strong></p>' + err.data.message);
        }
      );
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
      const modalRef = this.modalService.open(MoveSymbolsModalComponent);
      modalRef.componentInstance.symbols = selectedSymbols;
    }
  }

  importSymbols(): void {
    const modalRef = this.modalService.open(ImportSymbolsModalComponent);
    modalRef.componentInstance.groups = this.groups;
    modalRef.result.then(data => {
      if (data.type === 'symbols') {
        this.addSymbols(data.symbols);
      } else {
        data.groups.forEach(g => this.addGroup(g));
      }
    });
  }

  selectSymbol(symbol: AlphabetSymbol): void {
    this.router.navigate(['/app', 'projects', this.project.id, 'symbols', symbol.id]);
  }

  /**
   * Deletes all properties that are not needed for downloading symbols which are the id, project, group
   * and hidden properties. They are removed so that they can later be uploaded and created like new symbols.
   */
  exportSelectedSymbols(): void {
    if (this.selectedSymbols.getSelected().length > 0) {
      const modalRef = this.modalService.open(ExportSymbolsModalComponent);
      modalRef.componentInstance.groups = this.groups;
      modalRef.componentInstance.selectedSymbols = this.selectedSymbols;
    } else {
      this.toastService.info('You have to select at least one symbol.');
    }
  }

  openSymbolCreateModal(): void {
    const modalRef = this.modalService.open(CreateSymbolModalComponent);
    modalRef.componentInstance.groups = this.groups;
    modalRef.componentInstance.created.subscribe((s: AlphabetSymbol) => this.addSymbol(s));
  }

  openSymbolGroupCreateModal(): void {
    const modalRef = this.modalService.open(CreateSymbolGroupModalComponent);
    modalRef.result
      .then(group => this.addGroup(group))
      .catch(() => {
      });
  }
}
