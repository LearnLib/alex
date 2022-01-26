/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { Injectable } from '@angular/core';
import { AppStoreService } from '../../services/app-store.service';
import { SymbolGroupApiService } from '../../services/api/symbol-group-api.service';
import { SymbolApiService } from '../../services/api/symbol-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SymbolGroup } from '../../entities/symbol-group';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSymbolGroupModalComponent } from './create-symbol-group-modal/create-symbol-group-modal.component';
import { removeItems, replaceItem } from '../../utils/list-utils';
import { orderBy, remove } from 'lodash';
import { EditSymbolGroupModalComponent } from './edit-symbol-group-modal/edit-symbol-group-modal.component';
import { CreateSymbolModalComponent } from './create-symbol-modal/create-symbol-modal.component';
import { MoveSymbolGroupModalComponent } from './move-symbol-group-modal/move-symbol-group-modal.component';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { ToastService } from '../../services/toast.service';
import { PromptService } from '../../services/prompt.service';
import { EditSymbolModalComponent } from './edit-symbol-modal/edit-symbol-modal.component';
import { MoveSymbolsModalComponent } from './move-symbols-modal/move-symbols-modal.component';
import { Selectable } from '../../utils/selectable';
import { map } from 'rxjs/operators';
import { SymbolGroupLockInfo, SymbolLockInfo, SymbolPresenceService } from '../../services/symbol-presence.service';

@Injectable()
export class SymbolsViewStoreService {

  readonly symbolsSelectable = new Selectable<AlphabetSymbol, number>(s => s.id);

  readonly groupsCollapsedMap = new Map<number, boolean>();

  private groups = new BehaviorSubject<SymbolGroup[]>([]);

  private groupsMap = new Map<number, SymbolGroup>();

  private groupLocks = new BehaviorSubject<Map<number, SymbolGroupLockInfo>>(null);

  private symbolLocks = new BehaviorSubject<Map<number, SymbolLockInfo>>(null);

  constructor(private appStore: AppStoreService,
              private symbolGroupApi: SymbolGroupApiService,
              private symbolApi: SymbolApiService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private promptService: PromptService,
              private symbolPresenceService: SymbolPresenceService) {
  }

  load(): void {
    this.symbolGroupApi.getAll(this.appStore.project.id).subscribe(
      groups => {
        this.groups.next(groups);
        groups.forEach(group => {
          this.groupsCollapsedMap.set(group.id, false);
          group.walk(g => {
            this.groupsMap.set(g.id, g);
            this.symbolsSelectable.addItems(g.symbols);
          }, () => {
          });
        });
      }
    );

    this.symbolPresenceService.accessedSymbolGroups$.subscribe(groupLocks => {
      if (this.appStore.project) {
        this.groupLocks.next(groupLocks.get(this.appStore.project.id));
      }
    });

    this.symbolPresenceService.accessedSymbols$.subscribe(symbolLocks => {
      if (this.appStore.project) {
        this.symbolLocks.next(symbolLocks.get(this.appStore.project.id));
      }
    });
  }

  createSymbol(): void {
    const modalRef = this.modalService.open(CreateSymbolModalComponent);
    modalRef.componentInstance.groups = this.groups.value;
    modalRef.componentInstance.created.subscribe(createdSymbol => {
      this.groupsMap.get(createdSymbol.group).symbols.push(createdSymbol);
      this.symbolsSelectable.addItem(createdSymbol);
    });
  }

  updateSymbol(symbol: AlphabetSymbol): void {
    const modalRef = this.modalService.open(EditSymbolModalComponent);
    modalRef.componentInstance.symbol = symbol.copy();
    modalRef.result.then(updatedSymbol => {
      const group = this.groupsMap.get(updatedSymbol.group);
      group.symbols = replaceItem(group.symbols, s => s.id === updatedSymbol.id, updatedSymbol);
      this.symbolsSelectable.update(updatedSymbol);
    }).catch(() => {
    });
  }

  copySymbol(symbol: AlphabetSymbol): void {
    const newName = symbol.name + ' - Copy';
    this.promptService.prompt('Enter a name for the new symbol', {defaultValue: newName})
      .then(name => {

        this.symbolApi.export(symbol.project, {symbolIds: [symbol.id], symbolsOnly: true}).subscribe(
          body => {
            const symbolToCreate = body.symbols[0];
            symbolToCreate.name = name;
            symbolToCreate.group = symbol.group;

            // first create the symbol without actions
            return this.symbolApi.create(symbol.project, symbolToCreate).subscribe(
              copiedSymbols => {
                this.groupsMap.get(copiedSymbols.group).symbols.push(copiedSymbols);
                this.symbolsSelectable.update(copiedSymbols);
                this.toastService.success('The symbol has been copied.');
              }
            );
          },
          res => {
            this.toastService.danger(`The symbol could not be created. ${res.error.message}`);
          }
        );
      });
  }

  moveSymbol(symbol: AlphabetSymbol): void {
    const modalRef = this.modalService.open(MoveSymbolsModalComponent);
    modalRef.componentInstance.symbols = [symbol.copy()];
    modalRef.result
      .then(targetGroup => this._moveSymbol(symbol, targetGroup))
      .catch(() => {});
  }

  moveSelectedSymbols(): void {
    const selectedSymbols = this.symbolsSelectable.getSelected();
    const modalRef = this.modalService.open(MoveSymbolsModalComponent);
    modalRef.componentInstance.symbols = selectedSymbols.map(s => s.copy());
    modalRef.result
      .then(targetGroup => selectedSymbols.forEach(s => this._moveSymbol(s, targetGroup)))
      .catch(() => {});
  }

  deleteSymbol(symbol: AlphabetSymbol): void {
    this.symbolApi.remove(symbol).subscribe(
      () => {
        this._deleteSymbol(symbol);
      }, res => {
        this.toastService.danger(`The symbol could not be deleted. ${res.error.message}`);
      });
  }

  deleteSelectedSymbols(): void {
    const selectedSymbols = this.symbolsSelectable.getSelected();
    this.symbolApi.removeMany(this.appStore.project.id, selectedSymbols).subscribe(
      () => selectedSymbols.forEach(s => this._deleteSymbol(s)),
      res => this.toastService.danger(`Failed to deleted symbols. ${res.error.message}`)
    );
  }

  createGroup(): void {
    const modalRef = this.modalService.open(CreateSymbolGroupModalComponent);
    modalRef.result.then(group => {
      this._addGroup(group);
    }).catch(() => {
    });
  }

  updateGroup(group: SymbolGroup): void {
    const modalRef = this.modalService.open(EditSymbolGroupModalComponent);
    modalRef.componentInstance.group = group.copy();
    modalRef.result.then(updatedGroup => {
      this.groupsMap.get(updatedGroup.id).name = updatedGroup.name;
    }).catch(() => {
    });
  }

  moveGroup(group: SymbolGroup): void {
    const modalRef = this.modalService.open(MoveSymbolGroupModalComponent);
    modalRef.componentInstance.group = group.copy();
    modalRef.result.then(movedGroup => {
      if (group.parent == null) {
        this.groups.next(removeItems(this.groups.value, g => g.id === group.id));
      } else {
        remove(this.groupsMap.get(group.parent).groups, g => g.id === group.id);
      }

      if (movedGroup.parent == null) {
        this.groups.next([...this.groups.value, movedGroup]);
        this.groupsCollapsedMap.set(movedGroup.id, false);
      } else {
        this.groupsMap.get(movedGroup.parent).groups.push(movedGroup);
      }
    }).catch(() => {
    });
  }

  deleteGroup(group: SymbolGroup): void {
    this.symbolGroupApi.remove(group).subscribe(
      () => {
        if (group.parent == null) {
          this.groups.next(removeItems(this.groups.value, g => g.id === group.id));
        } else {
          remove(this.groupsMap.get(group.parent).groups, g => g.id === group.id);
        }
        group.walk(() => {
        }, s => this._deleteSymbol(s));
        this.groupsMap.delete(group.id);
        this.groupsCollapsedMap.delete(group.id);
      }
    );
  }

  isGroupCollapsed(group: SymbolGroup): boolean {
    const collapsed = this.groupsCollapsedMap.get(group.id);
    if (collapsed == null) {
      this.groupsCollapsedMap.set(group.id, true);
      return true;
    } else {
      return collapsed;
    }
  }

  toggleCollapseGroup(group: SymbolGroup): void {
    const collapsed = this.groupsCollapsedMap.get(group.id);
    if (collapsed == null) {
      this.groupsCollapsedMap.set(group.id, false);
    } else {
      this.groupsCollapsedMap.set(group.id, !collapsed);
    }
  }

  collapseAll(collapse: boolean): void {
    this.groupsMap.forEach((group, id) => {
        this.groupsCollapsedMap.set(id, collapse);
    });
  }

  selectedContainsLockedItem(): boolean {
    return this.symbolsSelectable.getSelected().some(value => this.symbolLocks.getValue()?.has(value.id));
  }

  isSymbolLocked(symbolId: number): boolean {
    return this.symbolLocks.getValue()?.has(symbolId);
  }

  isSymbolOwner(symbolId: number): boolean {
    return this.symbolLocks.getValue()?.get(symbolId)?.username === this.appStore.getUsername();
  }

  isGroupLocked(groupId: number): boolean {
    return this.groupLocks.getValue()?.has(groupId);
  }

  private _addGroup(group: SymbolGroup): void {
    if (group.parent == null) {
      this.groups.next([...this.groups.value, group]);
    } else {
      this.groupsMap.get(group.parent).groups.push(group);
    }
    this.groupsMap.set(group.id, group);
  }

  private _deleteSymbol(symbol: AlphabetSymbol): void {
    remove(this.groupsMap.get(symbol.group).symbols, s => s.id === symbol.id);
    this.symbolsSelectable.remove(symbol);
  }

  private _moveSymbol(symbol: AlphabetSymbol, targetGroup: SymbolGroup) {
    remove(this.groupsMap.get(symbol.group).symbols, s => s.id === symbol.id);
    this.groupsMap.get(targetGroup.id).symbols.push(symbol);
    symbol.group = targetGroup.id;
  }

  get groups$(): Observable<SymbolGroup[]> {
    return this.groups.asObservable();
  }

  get orderedGroups$(): Observable<SymbolGroup[]> {
    return this.groups.pipe(
      map(groups => orderBy(groups, ['name']))
    );
  }

  get symbolLocks$(): Observable<any> {
    return this.symbolLocks.asObservable();
  }

  get groupLocks$(): Observable<any> {
    return this.groupLocks.asObservable();
  }
}
