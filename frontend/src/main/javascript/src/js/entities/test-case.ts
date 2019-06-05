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

import { TestCaseStep } from './test-case-step';

export class TestCase {
  readonly type: string = 'case';
  name: string;
  parent?: number;
  project: number;
  preSteps: TestCaseStep[];
  steps: TestCaseStep[];
  postSteps: TestCaseStep[];

  constructor() {
    this.steps = [];
  }

  static fromData(data: any = {}): TestCase {
    const tc = new TestCase();
    tc.name = data.name;
    tc.parent = data.parent;
    tc.project = data.project;

    if (data.preSteps && data.preSteps.length) {
      tc.preSteps = data.preSteps.map(s => new TestCaseStep(s));
    }

    if (data.steps && data.steps.length) {
      tc.steps = data.steps.map(s => new TestCaseStep(s));
    }

    if (data.postSteps && data.postSteps.length) {
      tc.postSteps = data.postSteps.map(s => new TestCaseStep(s));
    }

    return tc;
  }
}