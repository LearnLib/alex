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

import { TestCaseStep } from './test-case-step';
import { TestSuite } from './test-suite';
import { User } from './user';

export class TestCase {
  readonly type: string = 'case';
  id: number;
  name: string;
  parent?: number;
  project: number;
  preSteps: TestCaseStep[];
  steps: TestCaseStep[];
  postSteps: TestCaseStep[];
  lastUpdatedBy: User;
  updatedOn: string;
  generated: boolean;

  constructor() {
    this.steps = [];
  }

  static fromData(data: any = {}): TestCase {
    const tc = new TestCase();
    tc.id = data.id;
    tc.name = data.name;
    tc.parent = data.parent;
    tc.project = data.project;
    tc.updatedOn = data.updatedOn;
    tc.generated = data.generated;

    if (data.preSteps && data.preSteps.length) {
      tc.preSteps = data.preSteps.map(s => new TestCaseStep(s));
    }

    if (data.steps && data.steps.length) {
      tc.steps = data.steps.map(s => new TestCaseStep(s));
    }

    if (data.postSteps && data.postSteps.length) {
      tc.postSteps = data.postSteps.map(s => new TestCaseStep(s));
    }

    if (data.lastUpdatedBy) {
      tc.lastUpdatedBy = User.fromData(data.lastUpdatedBy);
    }

    return tc;
  }

  static findSuiteById(root: TestSuite, suiteId: number): TestSuite {

    const find = (test: TestSuite) => {
      if (test.id === suiteId) {
        return test;
      }

      for (const t of test.tests) {
        if (t instanceof TestSuite) {
          const s = find(t);
          if (s != null) {
            return s;
          }
        }
      }
    };

    const res = find(root);
    return res != null ? res : null;
  }

  static getTestPath(root: TestSuite, test: TestCase|TestSuite): string {
    let current = this.findSuiteById(root, test.parent);
    const suiteNames = [current.name];

    while (current.parent) {
      current = this.findSuiteById(root, current.parent);
      suiteNames.push(current.name);
    }

    return `/${suiteNames.reverse().join('/')}/`;
  }
}
