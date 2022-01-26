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

import { TestCase } from './test-case';

export class TestSuite {
  readonly type: string = 'suite';
  id: number;
  name: string;
  parent?: number;
  project: number;
  tests: (TestCase|TestSuite)[];

  constructor() {
    this.tests = [];
  }

  static fromData(data: any = {}): TestSuite {
    const ts = new TestSuite();
    ts.id = data.id;
    ts.name = data.name;
    ts.parent = data.parent;
    ts.project = data.project;

    if (data.tests) {
      data.tests.forEach(t => {
          ts.tests.push(t.type === 'case' ? TestCase.fromData(t) : TestSuite.fromData(t));
      });
    }

    return ts;
  }
}
