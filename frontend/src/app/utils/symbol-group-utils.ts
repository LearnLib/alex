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

import { AlphabetSymbol } from '../entities/alphabet-symbol';
import { SymbolGroup } from '../entities/symbol-group';

/**
 * Utilities for symbol groups.
 */
export class SymbolGroupUtils {

  /**
   * Get all symbols of multiple symbol groups.
   *
   * @param groups The groups to get the symbols from.
   * @return All symbols in the groups.
   */
  static getSymbols(groups: SymbolGroup[]): AlphabetSymbol[] {
    const symbols = [];
    groups.forEach(group => group.walk(() => {}, s => symbols.push(s)));
    return symbols;
  }

  /**
   * Find the symbol group of a symbol.
   *
   * @param groups The groups to search in.
   * @param groupId The id of the group.
   * @return The group that contains the symbol
   */
  static findGroupById(groups: SymbolGroup[], groupId: number): SymbolGroup {
    const root = {groups};

    const find = (group) => {
      if (group.id === groupId) {
        return group;
      }

      for (const gr of group.groups) {
        const g = find(gr);
        if (g != null) {
          return g;
        }
      }
    };

    const res = find(root);
    return res != null ? res : null;
  }

  /**
   * Get the default group.
   *
   * @param groups The groups where to look for the default group.
   * @return The default symbol group.
   */
  static findDefaultGroup(groups: SymbolGroup[]): SymbolGroup {
    return groups.reduce((acc, val) => val.id < acc.id ? val : acc);
  }

  static getSymbolPath(groups: SymbolGroup[], symbol: AlphabetSymbol): string {
    let current = this.findGroupById(groups, symbol.group);
    const groupNames = [current.name];

    while (current.parent) {
      current = this.findGroupById(groups, current.parent);
      groupNames.push(current.name);
    }

    return groupNames.reverse().join(' / ');
  }

}
