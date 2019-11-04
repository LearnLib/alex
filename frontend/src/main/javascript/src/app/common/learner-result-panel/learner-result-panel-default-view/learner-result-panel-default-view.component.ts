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

import { LearnerResult } from '../../../entities/learner-result';
import { PromptService } from '../../../services/prompt.service';
import { DownloadService } from '../../../services/download.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerResultDetailsModalComponent } from '../../modals/learner-result-details-modal/learner-result-details-modal.component';
import { FormUtilsService } from '../../../services/form-utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
    const hypothesis = this.result.steps[this.pointer].hypothesis;

    const edges = {};
    hypothesis.edges.forEach(edge => {
      if (!edges[edge.from]) {
        edges[edge.from] = {};
      }
      if (!edges[edge.from][edge.to]) {
        edges[edge.from][edge.to] = '';
      }
      edges[edge.from][edge.to] += `${edge.input} / ${edge.output}\\n`;
    });

    let dot = 'digraph g {\n';
    dot += '  __start0 [label="" shape="none"];\n\n';
    hypothesis.nodes.forEach(node => {
      dot += `  ${node} [shape="circle" label="${node}"];\n`;
    });
    dot += '\n';
    for (let from in edges) {
      for (let to in edges[from]) {
        dot += `  ${from} -> ${to} [label="${edges[from][to]}"];\n`;
      }
    }
    dot += '\n';
    dot += '  __start0 -> 0;\n';
    dot += '}';

    this.promptService.prompt('Enter a name for the dot file')
      .then(filename => this.downloadService.downloadText(filename, 'dot', dot));
  }
}
