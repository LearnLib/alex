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

import { LearnerResult } from '../../entities/learner-result';
import { LearnerApiService } from '../../services/api/learner-api.service';
import { ToastService } from '../../services/toast.service';
import { LearnerResultApiService } from '../../services/api/learner-result-api.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { ErrorViewStoreService } from '../error-view/error-view-store.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SeparatingWordModalComponent } from '../../common/modals/separating-word-modal/separating-word-modal.component';
import { LearnerResultListModalComponent } from './learner-result-list-modal/learner-result-list-modal.component';
import {
  DifferenceTreeAutomataInput,
  DifferenceTreeLearnerResultInput
} from '../../entities/inputs/difference-tree-input';

interface Panel {
  result: LearnerResult;
  step: number;
}

/**
 * The controller that handles the page for displaying multiple complete learn results in a slide show.
 */
@Component({
  selector: 'learner-results-compare-view',
  templateUrl: './learner-results-compare-view.component.html',
  styleUrls: ['./learner-results-compare-view.component.scss']
})
export class LearnerResultsCompareViewComponent implements OnInit {

  /** All final learn results from all tests that were made for a project. */
  results: LearnerResult[];

  /** The list of active panels where each panel contains a complete learn result set. */
  panels: Panel[];

  activePanel: number;

  constructor(private modalService: NgbModal,
              private currentRoute: ActivatedRoute,
              private appStore: AppStoreService,
              private learnerResultApi: LearnerResultApiService,
              private learnerApi: LearnerApiService,
              private errorViewStore: ErrorViewStoreService,
              private toastService: ToastService) {

    this.results = [];
    this.panels = [];
    this.activePanel = 0;
  }

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe(map => {
      const resultIds = map.get('resultIds').split(',');
      this.learnerResultApi.getAll(this.project.id).subscribe(
        results => {
          this.results = results;
          this.panels = results.filter(r => resultIds.indexOf(r.id.toString()) > -1).map(r => ({
            result: r,
            step: r.steps.length - 1
          }));
          this.activePanel = 0;
        },
        console.error
      );
    });
  }

  /**
   * Removes a panel by a given index.
   *
   * @param index The index of the panel to remove.
   */
  closePanel(index: number): void {
    this.panels.splice(index, 1);

    if (this.panels.length > 0) {
      this.activePanel = 0;
    }

    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }

  /**
   * Test if a separating word between the first two displayed hypotheses can be found.
   */
  showSeparatingWord(): void {
    const hypA = this.panels[0].result.steps[this.panels[0].step].hypothesis;
    const hypB = this.panels[1].result.steps[this.panels[1].step].hypothesis;

    this.learnerApi.getSeparatingWord(this.project.id, hypA, hypB).subscribe(
      diff => {
        if (diff.input.length === 0) {
          this.toastService.info('The two hypotheses are identical.');
        } else {
          const modalRef = this.modalService.open(SeparatingWordModalComponent);
          modalRef.componentInstance.diff = diff;
          modalRef.componentInstance.result1 = this.panels[0].result;
          modalRef.componentInstance.result2 = this.panels[1].result;
        }
      },
      res => this.toastService.danger(res.error.message)
    );
  }

  /**
   * Gets the difference tree of the two displayed hypotheses
   */
  showDifferenceTree(): void {
    const hasResult = this.panels[0].result == null ||  this.panels[1].result == null;
    const input: DifferenceTreeAutomataInput | DifferenceTreeLearnerResultInput = hasResult
      ? {
        type: 'automata',
        strategy: 'WP_METHOD',
        automaton1: this.panels[0].result.steps[this.panels[0].step].hypothesis,
        automaton2: this.panels[1].result.steps[this.panels[1].step].hypothesis
      }
      : {
        type: 'learnerResults',
        strategy: 'DISCRIMINATION_TREE',
        result1: this.panels[0].result.testNo,
        step1: this.panels[0].step,
        result2: this.panels[1].result.testNo,
        step2: this.panels[1].step
      };

    this.learnerApi.getDifferenceTree(this.project.id, input).subscribe({
      next: data => {
        if (data.edges.length === 0) {
          this.toastService.info('Cannot find a difference.');
        } else {
          this.addPanel({
            steps: [{hypothesis: data}],
            testNo: `Diff. Tree ${this.panels[0].result.testNo} vs. ${this.panels[1].result.testNo}`,
            setup: {
              algorithm: {
                name: '*'
              }
            }
          } as any);
        }
      },
      error: res => this.toastService.danger(res.error.message)
    });
  }
  showDifferenceAutomaton(): void {
    const hypA = this.panels[0].result.steps[this.panels[0].step].hypothesis;
    const hypB = this.panels[1].result.steps[this.panels[1].step].hypothesis;

    this.learnerApi.getDifferenceAutomaton(this.project.id, hypA, hypB).subscribe(
      data => {
          this.addPanel({
            steps: [{hypothesis: data}],
            testNo: `Diff. Automaton ${this.panels[0].result.testNo} vs. ${this.panels[1].result.testNo}`,
            setup: {
              algorithm: {
                name: '*'
              }
            }
          } as any);
      },
      res => this.toastService.danger(res.error.message)
    );
  }

  openResultListModal(): void {
    const modalRef = this.modalService.open(LearnerResultListModalComponent);
    modalRef.componentInstance.results = this.results;
    modalRef.result
      .then((result: LearnerResult) => this.addPanel(result))
      .catch(() => {});
  }

  private addPanel(result: LearnerResult) {
    this.panels.push({
      result,
      step: result.steps.length - 1
    });
    this.activePanel = this.panels.length - 1;
  }

  get project(): Project {
    return this.appStore.project;
  }
}
