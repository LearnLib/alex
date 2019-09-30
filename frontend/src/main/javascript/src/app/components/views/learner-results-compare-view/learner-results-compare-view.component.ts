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

import { LearnResult } from '../../../entities/learner-result';
import { ProjectService } from '../../../services/project.service';
import { LearnerResource } from '../../../services/resources/learner-resource.service';
import { ToastService } from '../../../services/toast.service';
import { LearnResultResource } from '../../../services/resources/learner-result-resource.service';
import { Project } from '../../../entities/project';

/**
 * The controller that handles the page for displaying multiple complete learn results in a slide show.
 */
class ResultsCompareViewComponent {

  /** All final learn results from all tests that were made for a project. */
  public results: LearnResult[];

  /** The list of active panels where each panel contains a complete learn result set. */
  public panels: LearnResult[];

  /** The indeces of the steps that are displayed. */
  public panelPointers: number[];

  /** The list of layout settings for the current hypothesis that is shown in a panel. */
  public layoutSettings: any;

  /**
   * Constructor.
   *
   * @param $uibModal
   * @param $state
   * @param $stateParams
   * @param projectService
   * @param learnResultResource
   * @param learnerResource
   * @param toastService
   */
  /* @ngInject */
  constructor(private $uibModal: any,
              private $state: any,
              private $stateParams: any,
              private projectService: ProjectService,
              private learnResultResource: LearnResultResource,
              private learnerResource: LearnerResource,
              private toastService: ToastService) {

    this.results = [];
    this.panels = [];
    this.panelPointers = [];
    this.layoutSettings = [];

    // load all final learn results of all test an then load the complete test results from the test numbers
    // that are passed from the url in the panels
    if (!this.$stateParams.testNos) {
      this.$state.go('error', {message: 'There are no test numbers defined in the URL'});
    } else {
      const testNos = $stateParams.testNos.split(',');
      this.learnResultResource.getAll(this.project.id)
        .then(results => {
          this.results = results;
          this.panels = results.filter((r) => {
            return testNos.indexOf('' + r.testNo.toString()) > -1;
          });
        })
        .catch(console.error);
    }
  }

  /**
   * Removes a panel by a given index.
   *
   * @param index The index of the panel to remove.
   */
  closePanel(index: number): void {
    this.panels[index] = null;
    this.panels.splice(index, 1);
    this.panelPointers.splice(index, 1);
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  /**
   * Get the pointer to the step of the displayed hypotheses.
   *
   * @param index
   * @param pointer
   */
  onStep(index: number, pointer: number): void {
    this.panelPointers[index] = pointer;
  }

  /**
   * Test if a separating word between the first two displayed hypotheses can be found.
   */
  showSeparatingWord(): void {
    const hypA = this.panels[0].steps[this.panelPointers[0]].hypothesis;
    const hypB = this.panels[1].steps[this.panelPointers[1]].hypothesis;

    this.learnerResource.getSeparatingWord(hypA, hypB)
      .then(diff => {
        if (diff.input.length === 0) {
          this.toastService.info('The two hypotheses are identical.');
        } else {
          this.$uibModal.open({
            component: 'separatingWordModal',
            resolve: {
              diff: () => diff,
              result1: () => this.panels[0],
              result2: () => this.panels[1]
            }
          });
        }
      })
      .catch(err => this.toastService.danger(err.data.message));
  }

  /**
   * Gets the difference tree of the two displayed hypotheses
   */
  showDifferenceTree(): void {
    let hypLeft = this.panels[0].steps[this.panelPointers[0]].hypothesis;
    let hypRight = this.panels[1].steps[this.panelPointers[1]].hypothesis;

    this.learnerResource.getDifferenceTree(hypLeft, hypRight)
      .then(data => {
        if (data.edges.length === 0) {
          this.toastService.info('Cannot find a difference.');
        } else {
          this.panels.push(<any> {hypothesis: data, steps: [{hypothesis: data}]});
        }
      })
      .catch(err => this.toastService.danger(err.data.message));
  }

  openResultListModal(): void {
    this.$uibModal.open({
      component: 'resultListModal',
      resolve: {
        results: () => this.results
      }
    }).result.then(result => this.panels.push(result));
  }

  get project(): Project {
    return this.projectService.store.currentProject;
  }
}

export const resultsCompareViewComponent = {
  controller: ResultsCompareViewComponent,
  controllerAs: 'vm',
  template: require('html-loader!./learner-results-compare-view.component.html')
};
