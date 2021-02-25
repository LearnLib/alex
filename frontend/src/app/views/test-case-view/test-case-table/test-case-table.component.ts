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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'test-case-table',
  styleUrls: ['./test-case-table.component.scss'],
  templateUrl: './test-case-table.component.html'
})
export class TestCaseTableComponent implements OnInit, OnDestroy {

  @Input()
  testCase: any;

  @Input()
  result: any;

  @Input()
  symbolMap: any;

  constructor(private dragulaService: DragulaService) {
  }

  ngOnInit() {
    this.dragulaService.createGroup('STEPS', {
      moves: (el, container, handle) => handle.classList.contains('handle'),
      removeOnSpill: false
    });
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('STEPS');
  }
}
