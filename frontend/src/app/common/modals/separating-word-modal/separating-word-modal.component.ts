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

import { LearnerResult } from '../../../entities/learner-result';
import { TestApiService } from '../../../services/api/test-api.service';
import { TestCase } from '../../../entities/test-case';
import { TestCaseStep } from '../../../entities/test-case-step';
import { ToastService } from '../../../services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'separating-word-modal',
  templateUrl: './separating-word-modal.component.html'
})
export class SeparatingWordModalComponent {

  /** The separating word. */
  @Input()
  public diff: any;

  @Input()
  public result1: LearnerResult;

  @Input()
  public result2: LearnerResult;

  /** Constructor. */
  constructor(private testApi: TestApiService,
              private toastService: ToastService,
              public modal: NgbActiveModal) {
  }

  generateTestCase(which: number): void {
    const result = which === 1 ? this.result1 : this.result2;
    const setup = result.setup;
    const symbolMap = {};
    setup.symbols.forEach(s => symbolMap[s.getAliasOrComputedName()] = s);

    const tc = new TestCase();
    tc.name = 'Test Case';
    tc.project = result.project;

    const preStep = TestCaseStep.fromSymbol(setup.preSymbol.symbol);
    preStep.pSymbol.parameterValues = setup.preSymbol.parameterValues;
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

    const postStep = setup.postSymbol == null ? null : TestCaseStep.fromSymbol(setup.postSymbol.symbol);
    if (postStep != null) {
      postStep.pSymbol.parameterValues = setup.postSymbol.parameterValues;
      tc.postSteps = [postStep];
    }

    this.testApi.create(tc).subscribe(
      () => this.toastService.success('The test case has been created.'),
      () => this.toastService.danger('The test case could not be created.')
    );
  }
}
