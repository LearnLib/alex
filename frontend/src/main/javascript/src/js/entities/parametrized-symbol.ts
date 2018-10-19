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

import {AlphabetSymbol} from './alphabet-symbol';

/**
 * The parametrized symbol.
 */
export class ParametrizedSymbol {

  /** The ID of the parameterized symbol. */
  public id: number;

  /** The symbol to execute. */
  public symbol: AlphabetSymbol;

  /** The parameter values for the symbol. */
  public parameterValues: any[];

  /**
   * Constructor.
   *
   * @param obj The object to create the parameterized symbol from.
   */
  constructor(obj: any = {}) {
    this.id = obj.id == null ? null : obj.id;
    this.symbol = obj.symbol != null ? new AlphabetSymbol(obj.symbol) : null;
    this.parameterValues = obj.parameterValues || [];
  }

  /** Get the string representation of the symbol with parameter values. */
  getComputedName(): string {
    const params = this.parameterValues
      .filter(v => !v.parameter.private && v.value != null)
      .map(v => v.value);

    if (params.length === 0) {
      return this.symbol.name;
    } else {
      return `${this.symbol.name} <${params.join(', ')}>`;
    }
  }

  /**
   * Create a parametrized symbol from a symbol.
   *
   * @param symbol The symbol.
   * @return The parameterized symbol.
   */
  static fromSymbol(symbol: AlphabetSymbol): ParametrizedSymbol {
    const pSymbol = new ParametrizedSymbol();
    pSymbol.symbol = <any> {
      id: symbol.id,
      name: symbol.name,
      expectedResult: symbol.expectedResult
    };
    pSymbol.parameterValues = symbol.inputs.map(input => ({parameter: input, value: null}));
    return pSymbol;
  }
}
