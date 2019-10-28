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
import { LearnerResultListModalComponent } from '../../common/modals/learner-result-list-modal/learner-result-list-modal.component';

/**
 * The controller that handles the page for displaying multiple complete learn results in a slide show.
 */
@Component({
  selector: 'learner-results-compare-view',
  templateUrl: './learner-results-compare-view.component.html'
})
export class LearnerResultsCompareViewComponent implements OnInit {

  /** All final learn results from all tests that were made for a project. */
  results: LearnerResult[];

  /** The list of active panels where each panel contains a complete learn result set. */
  panels: LearnerResult[];

  /** The indeces of the steps that are displayed. */
  panelPointers: number[];

  /** The list of layout settings for the current hypothesis that is shown in a panel. */
  layoutSettings: any;

  constructor(private modalService: NgbModal,
              private currentRoute: ActivatedRoute,
              private appStore: AppStoreService,
              private learnerResultApi: LearnerResultApiService,
              private learnerApi: LearnerApiService,
              private errorViewStore: ErrorViewStoreService,
              private toastService: ToastService) {

    this.results = [];
    this.panels = [];
    this.panelPointers = [];
    this.layoutSettings = [];
  }

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe(map => {
      const resultIds = map.get('resultIds').split(',');
      this.learnerResultApi.getAll(this.project.id).subscribe(
        results => {
          this.results = results;
          this.panels = results.filter((r) => {
            return resultIds.indexOf(r.testNo.toString()) > -1;
          });

          console.log()
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

    this.learnerApi.getSeparatingWord(hypA, hypB).subscribe(
      diff => {
        if (diff.input.length === 0) {
          this.toastService.info('The two hypotheses are identical.');
        } else {
          const modalRef = this.modalService.open(SeparatingWordModalComponent);
          modalRef.componentInstance.diff = diff;
          modalRef.componentInstance.result1 = this.panels[0];
          modalRef.componentInstance.result2 = this.panels[1];
        }
      },
      res => this.toastService.danger(res.error.message)
    );
  }

  /**
   * Gets the difference tree of the two displayed hypotheses
   */
  showDifferenceTree(): void {
    let hypLeft = this.panels[0].steps[this.panelPointers[0]].hypothesis;
    let hypRight = this.panels[1].steps[this.panelPointers[1]].hypothesis;

    this.learnerApi.getDifferenceTree(hypLeft, hypRight).subscribe(
      data => {
        if (data.edges.length === 0) {
          this.toastService.info('Cannot find a difference.');
        } else {
          this.panels.push(<any>{hypothesis: data, steps: [{hypothesis: data}]});
        }
      },
      res => this.toastService.danger(res.error.message)
    );
  }

  openResultListModal(): void {
    const modalRef = this.modalService.open(LearnerResultListModalComponent);
    modalRef.componentInstance.results = this.results;
    modalRef.result.then((result: LearnerResult) => this.panels.push(result));
  }

  get project(): Project {
    return this.appStore.project;
  }
}
