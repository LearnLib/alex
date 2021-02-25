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

import { AlphabetSymbol } from './alphabet-symbol';

/**
 * The model for symbol group.
 */
export class SymbolGroup {

  /** The name of the group. */
  public name: string;

  /** The id of the parent group. */
  public parent?: number;

  /** The id of the group. */
  public id: number;

  /** The id of the project the group belongs to. */
  public project: number;

  /** The visible symbols of the group. */
  public symbols: AlphabetSymbol[];

  /** The children symbol groups. */
  public groups: SymbolGroup[];

  /**
   * Constructor.
   *
   * @param obj The object to create the symbol group from.
   */
  constructor(obj: any = {}) {
    this.name = obj.name || null;
    this.parent = obj.parent || null;
    this.id = obj.id;
    this.project = obj.project;
    this.symbols = obj.symbols ? obj.symbols.filter(s => !s.hidden).map(s => new AlphabetSymbol(s)) : [];
    this.groups = obj.groups ? obj.groups.map(g => new SymbolGroup(g)) : [];
  }

  copy(): SymbolGroup {
    return new SymbolGroup(JSON.parse(JSON.stringify(this)));
  }

  walk(groupFn: (SymbolGroup) => void, symbolFn: (AlphabetSymbol) => void): void {
    groupFn(this);
    this.groups.forEach(g => g.walk(groupFn, symbolFn));
    this.symbols.forEach(s => symbolFn(s));
  }
}
