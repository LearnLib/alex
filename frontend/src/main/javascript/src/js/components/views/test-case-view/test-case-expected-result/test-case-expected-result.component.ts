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

export const testCaseExpectedResultComponent = {
  template: require('./test-case-expected-result.component.html'),
  bindings: {
    step: '='
  },
  controllerAs: 'vm',
  controller: class TestCaseExpectedResultComponent {

    public step: any;
    public edit: boolean;
    public expectedResult: string;

    /** Constructor. */
    constructor() {
      this.edit = false;
      this.expectedResult = '';
    }

    setEditMode(): void {
      this.edit = true;
      if (this.step.expectedResult !== '') {
        this.expectedResult = this.step.expectedResult;
      } else {
        this.expectedResult = this.step.pSymbol.symbol.expectedResult;
      }
    }

    save(): void {
      if (this.expectedResult === this.step.pSymbol.symbol.expectedResult
        || this.expectedResult === '') {
        this.step.expectedResult = '';
      } else {
        this.step.expectedResult = this.expectedResult;
      }

      this.cancel();
    }

    cancel(): void {
      this.expectedResult = '';
      this.edit = false;
    }

    setToDefault(): void {
      this.expectedResult = '';
      this.save();
    }
  }
};
