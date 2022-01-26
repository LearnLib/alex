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

import { Component, Input, OnInit } from '@angular/core';
import { TestSelectTreeStore } from './test-select-tree.store';

@Component({
  selector: 'test-select-tree',
  templateUrl: './test-select-tree.component.html',
  styleUrls: ['./test-select-tree.component.scss']
})
export class TestSelectTreeComponent implements OnInit {

  @Input()
  suite: any;

  constructor(public store: TestSelectTreeStore) {
  }

  ngOnInit() {
  }

  get childSuites() {
    return this.suite.tests.filter(test => test.type === 'suite');
  }

  get testCases() {
    return this.suite.tests.filter(test => test.type === 'case');
  }
}
