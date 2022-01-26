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

import { AlphabetSymbol } from './alphabet-symbol';

export interface SymbolOutputMapping {
  id?: number;
  name: string;
  parameter: any;
}

/**
 * The parametrized symbol.
 */
export class ParametrizedSymbol {

  /** The ID of the parameterized symbol. */
  id: number;

  /** The symbol to execute. */
  symbol: AlphabetSymbol;

  /** The parameter values for the symbol. */
  parameterValues: any[];

  outputMappings: SymbolOutputMapping[];

  alias: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the parameterized symbol from.
   */
  constructor(obj: any = {}) {
    this.id = obj.id == null ? null : obj.id;
    this.symbol = obj.symbol != null ? new AlphabetSymbol(obj.symbol) : null;
    this.parameterValues = obj.parameterValues || [];
    this.outputMappings = obj.outputMappings || [];
    this.alias = obj.alias;
  }

  /**
   * Create a parametrized symbol from a symbol.
   *
   * @param symbol The symbol.
   * @return The parameterized symbol.
   */
  static fromSymbol(symbol: AlphabetSymbol): ParametrizedSymbol {
    const pSymbol = new ParametrizedSymbol();
    pSymbol.symbol = {
      id: symbol.id,
      name: symbol.name,
      group: symbol.group,
      expectedResult: symbol.expectedResult
    } as any;
    pSymbol.parameterValues = symbol.inputs.map(input => ({parameter: input, value: null}));
    pSymbol.outputMappings = symbol.outputs.map(output => ({parameter: output, name: output.name}));
    return pSymbol;
  }

  /** Get the string representation of the symbol with parameter values. */
  getAliasOrComputedName(): string {
    if (this.alias != null && this.alias !== '') {
      return this.alias;
    } else {
      const params = this.parameterValues
        .filter(v => v.value != null)
        .map(v => v.value);

      if (params.length === 0) {
        return this.symbol.name;
      } else {
        return `${this.symbol.name} <${params.join(', ')}>`;
      }
    }
  }
}
