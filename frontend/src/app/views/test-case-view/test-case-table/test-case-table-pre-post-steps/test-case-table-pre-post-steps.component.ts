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

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'test-case-table-pre-post-steps',
  templateUrl: './test-case-table-pre-post-steps.component.html'
})
export class TestCaseTablePrePostStepsComponent {

  @Input()
  steps: any[];

  @Input()
  options: any;

  @Input()
  symbolMap: any;

  @Output()
  stepsChange: EventEmitter<any[]>;

  constructor() {
    this.steps = [];
    this.stepsChange = new EventEmitter<any[]>();
  }
}
