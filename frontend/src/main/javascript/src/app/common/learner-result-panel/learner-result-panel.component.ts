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

import { LearnerResult } from '../../entities/learner-result';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

/**
 * The directive that displays a browsable list of learn results. For each result, it can display the observation
 * table, if L* was used, or the Discrimination Tree from the corresponding algorithm.
 *
 * It expects an attribute 'results' which should contain a list of the learn results that should be displayed. It
 * can for example be the list of all intermediate results of a complete test or multiple single results from
 * multiple tests.
 *
 * Content that is written inside the tag will be displayed a the top right corner beside the index browser. So
 * just add small texts or additional buttons in there.
 */
@Component({
  selector: 'learner-result-panel',
  templateUrl: './learner-result-panel.component.html'
})
export class LearnerResultPanelComponent implements OnInit, OnChanges {

  @Output()
  step = new EventEmitter<any>();

  @Input()
  result: LearnerResult;

  @Input()
  index: number;

  @Input()
  layoutSettings: any;

  view: string;
  menu: any[];
  pointer: number;

  constructor() {
    this.layoutSettings = null;
    this.view = 'DEFAULT';
    this.menu = [];
    this.pointer = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.result) this.pointer = this.result.steps.length - 1;
  }

  ngOnInit(): void {
    /**
     * The index of the step from the results that should be shown.
     */
    this.pointer = this.result.steps.length - 1;
    this.emitStep();
  }

  registerMenu(menu: any): void {
    this.menu = menu;
  }

  /**
   * Emits the index of the currently shown step.
   */
  emitStep(): void {
    if (this.index >= 0) {
      this.step.emit(this.pointer);
    }
  }

  /**
   * Shows the first result of the test process.
   */
  firstStep(): void {
    this.pointer = 0;
    this.emitStep();
  }

  /**
   * Shows the previous result of the test process or the last if the first one is displayed.
   */
  previousStep(): void {
    if (this.pointer - 1 < 0) {
      this.lastStep();
    } else {
      this.pointer--;
      this.emitStep();
    }
  }

  /**
   * Shows the next result of the test process or the first if the last one is displayed.
   */
  nextStep(): void {
    if (this.pointer + 1 > this.result.steps.length - 1) {
      this.firstStep();
    } else {
      this.pointer++;
      this.emitStep();
    }
  }

  /**
   * Shows the last result of the test process.
   */
  lastStep(): void {
    this.pointer = this.result.steps.length - 1;
    this.emitStep();
  }
}
