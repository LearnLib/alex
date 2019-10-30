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

import { ActionService } from '../services/action.service';
import { ParametrizedSymbol } from './parametrized-symbol';

const actionService = new ActionService();

/**
 * The symbol model.
 */
export class AlphabetSymbol {

  /** The unique name of the symbol. */
  public name: string;

  /** The id of the group the symbol should be created in. */
  public group: number;

  /** The id of the symbol. */
  public id: number;

  /** The id of the project the symbol belongs to. */
  public project: number;

  /** The flag if the symbol has been deleted. */
  public hidden: boolean;

  /** The custom output of the symbol on success. */
  public successOutput: string;

  /** The list of input variables. */
  public inputs: any[];

  /** The list of output variables. */
  public outputs: any[];

  /** The steps that are executed in the symbol. */
  public steps: any[];

  /** The description of the symbol. */
  public description: string;

  /** The expected result of the symbol. */
  public expectedResult: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the symbol from.
   */
  constructor(obj: any = {}) {
    this.name = obj.name || null;
    this.group = obj.group || null;
    this.id = obj.id;
    this.project = obj.project;
    this.hidden = obj.hidden;
    this.successOutput = obj.successOutput;
    this.inputs = obj.inputs || [];
    this.outputs = obj.outputs || [];

    this.steps = obj.steps ? obj.steps.map(step => {
      if (step.type === 'symbol') {
        step.pSymbol = new ParametrizedSymbol(step.pSymbol);
      } else if (step.type === 'action') {
        step.action = actionService.create(step.action);
      }
      return step;
    }) : [];

    this.description = obj.description || '';
    this.expectedResult = obj.expectedResult || '';
  }

  static stepsToJson(step) {
    const s = JSON.parse(JSON.stringify(step));
    delete s.$$hashKey;
    delete s.symbol;
    delete s.id;
    if (s.type === 'symbol') {
      delete s.pSymbol.id;
      s.pSymbol.parameterValues.forEach(pv => {
        delete pv.id;
      });
    } else if (s.type === 'action') {
      delete s.action.id;
    }
    return s;
  }

  containsSymbolSteps() {
    return this.steps.filter(s => s.type === 'symbol').length > 0;
  }

  toJson() {
    const symbol = new AlphabetSymbol(JSON.parse(JSON.stringify(this)));
    symbol.steps.forEach(step => {
      if (step.type === 'symbol') {
        step.pSymbol.symbol = {id: step.pSymbol.symbol.id};
      }
    });
    return symbol;
  }

  copy(): AlphabetSymbol {
    return new AlphabetSymbol(JSON.parse(JSON.stringify(this)));
  }
}
