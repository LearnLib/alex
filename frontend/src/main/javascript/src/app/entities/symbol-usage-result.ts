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

import { AlphabetSymbol } from './alphabet-symbol';
import { TestCase } from './test-case';

export class SymbolUsageResult {
  symbols: AlphabetSymbol[];
  testCases: TestCase[];
  learnerResults: any[];
  inUse: boolean;

  constructor() {
    this.symbols = [];
    this.testCases = [];
    this.learnerResults = [];
    this.inUse = false;
  }

  static fromData(data: any): SymbolUsageResult {
    const r = new SymbolUsageResult();
    r.inUse = data.inUse;

    if (data.symbols != null && data.symbols.length > 0) {
      r.symbols = data.symbols.map(s => new AlphabetSymbol(s));
    }

    if (data.testCases != null && data.testCases.length > 0) {
      r.testCases = data.testCases.map(t => TestCase.fromData(t));
    }

    if (data.learnerResults != null && data.learnerResults.length > 0) {
      r.learnerResults = data.learnerResults;
    }

    return r;
  }
}
