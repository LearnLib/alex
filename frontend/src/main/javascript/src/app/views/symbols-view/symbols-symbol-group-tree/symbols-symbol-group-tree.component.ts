import { orderBy } from 'lodash';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolGroup } from '../../../entities/symbol-group';
import { Component, Input, OnInit } from '@angular/core';
import { SymbolsViewStoreService } from '../symbols-view-store.service';

@Component({
  selector: 'symbols-symbol-group-tree',
  templateUrl: './symbols-symbol-group-tree.component.html',
  styleUrls: ['./symbols-symbol-group-tree.component.scss']
})
export class SymbolsSymbolGroupTreeComponent {

  /** The symbol group to display. */
  @Input()
  group: SymbolGroup;

  constructor(public store: SymbolsViewStoreService) {
  }

  get orderedGroups(): SymbolGroup[] {
    return orderBy(this.group.groups, ['name']);
  }

  get orderedSymbols(): AlphabetSymbol[] {
    return orderBy(this.group.symbols, ['name']);
  }
}
