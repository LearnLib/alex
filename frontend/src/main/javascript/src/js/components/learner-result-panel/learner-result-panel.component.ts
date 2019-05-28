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

import {IScope} from 'angular';
import {LearnResult} from '../../entities/learner-result';

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
class LearnerResultPanelComponent {

  public onStep: () => ((n1: number, n2: number) => void);
  public result: LearnResult;
  public index: number;

  public layoutSettings: any;
  public view: string;
  public menu: any;
  public pointer: number;

  /**
   * Constructor.
   *
   * @param $scope
   * @param $uibModal
   */
  /* @ngInject */
  constructor(private $scope: IScope,
              private $uibModal: any) {

    this.layoutSettings = null;
    this.view = 'DEFAULT';
    this.menu = [];
    this.pointer = 0;
  }

  $onInit(): void {

    /**
     * The index of the step from the results that should be shown.
     * @type {number}
     */
    this.pointer = this.result.steps.length - 1;
    this.emitStep();

    this.$scope.$watch(() => this.result, () => {
      if (this.result) this.pointer = this.result.steps.length - 1;
    });
  }

  registerMenu(menu: any): void {
    this.menu = menu;
  }

  /**
   * Emits the index of the currently shown step.
   */
  emitStep(): void {
    if (this.index >= 0 && this.onStep()) {
      this.onStep()(this.index, this.pointer);
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

export const learnerResultPanelComponent = {
  template: require('./learner-result-panel.component.html'),
  transclude: true,
  controller: LearnerResultPanelComponent,
  controllerAs: 'vm',
  bindings: {
    result: '=',
    index: '=',
    onStep: '&'
  }
};
