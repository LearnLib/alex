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

import { ModalComponent } from '../modal.component';
import { LearnResult } from '../../../entities/learner-result';
import { TestApiService } from '../../../services/resources/test-api.service';
import { TestCase } from '../../../entities/test-case';
import { TestCaseStep } from '../../../entities/test-case-step';
import { ToastService } from '../../../services/toast.service';

export const separatingWordModalComponent = {
  template: require('html-loader!./separating-word-modal.component.html'),
  bindings: {
    dismiss: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SeparatingWordModalComponent extends ModalComponent {

    /** The separating word. */
    public diff: any = null;

    public result1: LearnResult;
    public result2: LearnResult;

    /** Constructor. */
    /* @ngInject */
    constructor(private testApi: TestApiService,
                private toastService: ToastService) {
      super();
    }

    $onInit(): void {
      this.diff = this.resolve.diff;
      this.result1 = this.resolve.result1;
      this.result2 = this.resolve.result2;
    }

    generateTestCase(which: number): void {
      const result = which == 1 ? this.result1 : this.result2;
      const symbolMap = {};
      result.symbols.forEach(s => symbolMap[s.getComputedName()] = s);

      const tc = new TestCase();
      tc.name = 'Test Case';
      tc.project = result.project;

      const preStep = TestCaseStep.fromSymbol(result.resetSymbol.symbol);
      preStep.pSymbol.parameterValues = result.resetSymbol.parameterValues;
      tc.preSteps = [preStep];

      for (let i = 0; i < this.diff.input.length; i++) {
        const output = which === 1 ? this.diff.output1[i] : this.diff.output2[i];

        const sym = symbolMap[this.diff.input[i]];
        const step = TestCaseStep.fromSymbol(sym.symbol);
        step.expectedOutputSuccess = output.startsWith('Ok');
        step.setExpectedOutputMessageFromOutput(output);
        step.pSymbol.parameterValues = sym.parameterValues;
        tc.steps.push(step);
      }

      const postStep = result.postSymbol == null ? null : TestCaseStep.fromSymbol(result.postSymbol.symbol);
      if (postStep != null) {
        postStep.pSymbol.parameterValues = result.postSymbol.parameterValues;
        tc.postSteps = [postStep];
      }

      this.testApi.create(tc).subscribe(
        () => this.toastService.success('The test case has been created.'),
        () => this.toastService.danger('The test case could not be created.')
      );
    }
  }
};
