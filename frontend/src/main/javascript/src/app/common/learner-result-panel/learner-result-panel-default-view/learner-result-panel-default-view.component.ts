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
import { PromptService } from '../../../services/prompt.service';
import { DownloadService } from '../../../services/download.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormUtilsService } from '../../../services/form-utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LearnerResultApiService } from '../../../services/api/learner-result-api.service';

@Component({
  selector: 'learner-result-panel-default-view',
  templateUrl: './learner-result-panel-default-view.component.html'
})
export class LearnerResultPanelDefaultViewComponent implements OnInit {

  @Output()
  layoutSettingsChange = new EventEmitter<any>();

  @Input()
  layoutSettings: any;

  @Input()
  result: LearnerResult;

  @Input()
  pointer: number;

  form = new FormGroup({
    nodePadding: new FormControl(0, [Validators.required, Validators.min(1)]),
    edgePadding: new FormControl(0, [Validators.required, Validators.min(1)]),
    rankPadding: new FormControl(0, [Validators.required, Validators.min(1)])
  });

  constructor(private modalService: NgbModal,
              private promptService: PromptService,
              private downloadService: DownloadService,
              private element: ElementRef,
              private learnerResultApi: LearnerResultApiService,
              public formUtils: FormUtilsService) {
  }

  ngOnInit(): void {
    this.form.controls.nodePadding.setValue(this.layoutSettings.nodePadding);
    this.form.controls.edgePadding.setValue(this.layoutSettings.edgePadding);
    this.form.controls.rankPadding.setValue(this.layoutSettings.rankPadding);
  }

  /**
   * Closes the modal window and passes the updated layout settings.
   */
  update(): void {
    const layout = {};
    Object.assign(layout, this.layoutSettings, this.form.value);
    this.layoutSettingsChange.emit(layout);
  }

  /**
   * Sets the layout settings to its default values.
   */
  defaultLayoutSettings(): void {
    this.form.controls.nodePadding.setValue(50);
    this.form.controls.edgePadding.setValue(35);
    this.form.controls.rankPadding.setValue(50);
    this.update();
  }

  /** Downloads the currently displayed hypothesis as svg. */
  exportHypothesisAsSvg(): void {
    let curr = this.element.nativeElement;
    while (curr != null) {
      curr = curr.parentNode;
      if (curr.nodeName === 'LEARNER-RESULT-PANEL') {
        const svg = curr.querySelector('svg');
        this.promptService.prompt('Enter a name for the svg file')
          .then(filename => this.downloadService.downloadSvgEl(svg, true, filename));
        break;
      }
    }
  }

  /** Downloads the currently displayed hypothesis as json. */
  exportHypothesisAsJson(): void {
    this.promptService.prompt('Enter a name for the json file')
      .then(filename => {
        this.downloadService.downloadObject(this.result.steps[this.pointer].hypothesis, filename);
      });
  }

  /** Downloads the currently visible hypothesis as dot file. */
  exportHypothesisAsDot(): void {
    this.promptService.prompt('Enter a name for the dot file')
      .then(filename => {
        this.learnerResultApi.export(this.result.project, this.result.testNo, this.pointer + 1).subscribe(
          data => this.downloadService.downloadText(filename, 'dot', data)
        );
      });
  }
}
