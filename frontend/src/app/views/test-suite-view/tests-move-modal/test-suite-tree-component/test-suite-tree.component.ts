/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'test-suite-tree',
  templateUrl: './test-suite-tree.component.html',
  styleUrls: ['./test-suite-tree.component.scss']
})
export class TestSuiteTreeComponent implements OnInit {

  @Output()
  selected = new EventEmitter<any>();

  @Input()
  selectedTestSuite: any;

  @Input()
  testSuite: any;

  @Input()
  level: any;

  /** If the children are collapsed. */
  collapse = false;

  ngOnInit(): void {
    this.level = this.level == null ? 0 : Number(this.level);
    if (this.level > 0) {
      this.collapse = true;
    }
  }

  /**
   * Get the test suites in the test.
   *
   * @return The test suites.
   */
  getTestSuites(): any[] {
    return this.testSuite.tests.filter(t => t.type === 'suite');
  }

  /**
   * Select the test suite where the tests should be moved to.
   *
   * @param testSuite The target test suite.
   */
  selectTestSuite(testSuite: any): void {
    this.selected.emit(testSuite);
  }
}
