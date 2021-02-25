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

import { LearnerResult } from '../../../entities/learner-result';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface Tab {
  heading: string;
  result: LearnerResult;
}

/**
 * The controller that is used to display the details of a learn result in a modal dialog. The data that is passed
 * to this controller should be an object with a property 'result' which contains a learn result object. If none is
 * given, nothing will be displayed.
 */
@Component({
  selector: 'learner-result-details-modal',
  templateUrl: './learner-result-details-modal.component.html'
})
export class LearnerResultDetailsModalComponent implements OnInit {

  /** The result to display information from. */
  @Input()
  result: LearnerResult;

  /** The index of the current step. */
  @Input()
  current: number;

  /** The data of the tabs that are displayed. */
  tabs: Tab[] = [];

  /** Constructor. */
  constructor(public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.tabs.push({heading: 'Cumulated', result: this.result});

    // add a tab with details for the current step only if it is defined
    // otherwise display the tab with the cumulated results only
    if (this.current != null) {
      this.tabs.unshift({heading: 'Current', result: this.result.steps[this.current]});
    }
  }
}

