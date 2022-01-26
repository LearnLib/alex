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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SymbolGroup } from '../../../../entities/symbol-group';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'test-case-table-pre-post-steps',
  templateUrl: './test-case-table-pre-post-steps.component.html',
  styleUrls: ['../test-case-table.component.scss']
})
export class TestCaseTablePrePostStepsComponent {

  @Input()
  steps: any[];

  @Input()
  symbolMap: any;

  @Input()
  groups: SymbolGroup[];

  @Input()
  dropListId: string;

  @Input()
  connectedDropListIds: string[] = [];

  @Output()
  stepsChange: EventEmitter<any[]>;

  constructor() {
    this.steps = [];
    this.stepsChange = new EventEmitter<any[]>();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
