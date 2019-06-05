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

import {ParametrizedSymbol} from './parametrized-symbol';

export class TestCaseStep {

  /** The expected result of the test step. */
  expectedResult: string;

  /** The symbol to execute in the step. */
  pSymbol: ParametrizedSymbol;

  expectedOutputSuccess: boolean;

  expectedOutputMessage: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the test case step from.
   */
  constructor(obj: any = {}) {
    this.expectedResult = obj.expectedResult || '';
    this.expectedOutputSuccess = obj.expectedOutputSuccess != null ? obj.expectedOutputSuccess : true;
    this.expectedOutputMessage = obj.expectedOutputMessage || '';
    this.pSymbol = obj.pSymbol == null ? null : new ParametrizedSymbol(obj.pSymbol);
  }

  /**
   * Create a new TestCaseStep from a symbol.
   *
   * @param symbol The symbol to create the step from.
   * @return The test case step.
   */
  static fromSymbol(symbol: any): TestCaseStep {
    return new TestCaseStep({
      expectedResult: symbol.expectedResult,
      pSymbol: ParametrizedSymbol.fromSymbol(symbol)
    });
  }

  setExpectedOutputMessageFromOutput(output: string) {
    const match = output.match(/^(Ok |Failed )\((.*?)\)$/);
    this.expectedOutputMessage = match == null ? '' : match[2];
  }

  getComputedOutputMessage(): string {
    return (this.expectedOutputSuccess ? "Ok" : "Failed") + (this.expectedOutputMessage === '' ? '' : ` (${this.expectedOutputMessage})`);
  }
}
