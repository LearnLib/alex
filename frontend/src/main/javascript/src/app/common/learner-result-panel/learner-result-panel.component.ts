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

import { LearnerResult } from '../../entities/learner-result';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LearnerResultPanelService } from './learner-result-panel.service';
import { Edge } from '../hypothesis/hypothesis.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerResultDetailsModalComponent } from '../modals/learner-result-details-modal/learner-result-details-modal.component';
import { PromptService } from '../../services/prompt.service';
import { DownloadService } from '../../services/download.service';

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
  templateUrl: './learner-result-panel.component.html',
  styleUrls: ['./learner-result-panel.component.scss'],
  providers: [LearnerResultPanelService]
})
export class LearnerResultPanelComponent implements OnInit {

  @Output()
  step = new EventEmitter<any>();

  @Output()
  selectEdge = new EventEmitter<Edge>();

  @Input()
  result: LearnerResult;

  @Input()
  layoutSettings = {
    orientation: 'TB',
    align: 'UL',
    ranker: 'tight-tree',
    multigraph: true,
    edgePadding: 35,
    rankPadding: 50,
    nodePadding: 50
  };

  @Input()
  pointer: number;

  view: string;

  showSidebar = false;

  constructor(public panelService: LearnerResultPanelService,
              private modalService: NgbModal,
              private promptService: PromptService,
              private element: ElementRef,
              private downloadService: DownloadService) {
    this.view = 'DEFAULT';
    this.pointer = 0;
  }

  ngOnInit(): void {

    /**
     * The index of the step from the results that should be shown.
     */
    this.pointer = this.pointer == null ? this.result.steps.length - 1 : this.pointer;
    this.emitStep();

    this.panelService.edgeSelected$.subscribe(edge => {
      this.selectEdge.emit(edge);
    });
  }

  /**
   * Emits the index of the currently shown step.
   */
  emitStep(): void {
    this.step.emit(this.pointer);
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

  openResultDetailsModal(): void {
    const modalRef = this.modalService.open(LearnerResultDetailsModalComponent);
    modalRef.componentInstance.result = this.result;
    modalRef.componentInstance.current = this.pointer;
  }

  /** Downloads the currently displayed observation table. */
  exportObservationTable(): void {
    const table = this.element.nativeElement.querySelector('.observation-table');
    this.promptService.prompt('Enter a name for the csv file')
      .then(filename => this.downloadService.downloadTableEl(table, filename));
  }

  /** Downloads the currently displayed hypothesis as svg. */
  exportHypothesisAsSvg(): void {
    const svg = this.element.nativeElement.querySelector('svg');
    this.promptService.prompt('Enter a name for the svg file')
      .then(filename => this.downloadService.downloadSvgEl(svg, true, filename));
  }
}
