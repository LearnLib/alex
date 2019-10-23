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

import { learningAlgorithm } from '../../../constants';
import { LearnerResult } from '../../../entities/learner-result';
import { PromptService } from '../../../services/prompt.service';
import { DownloadService } from '../../../services/download.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerResultDetailsModalComponent } from '../../modals/learner-result-details-modal/learner-result-details-modal.component';
import { HypothesisLayoutSettingsModalComponent } from '../hypothesis-layout-settings-modal/hypothesis-layout-settings-modal.component';

@Component({
  selector: 'learner-result-panel-default-view',
  templateUrl: './learner-result-panel-default-view.component.html'
})
export class LearnerResultPanelDefaultViewComponent implements OnInit {

  /** Available learn algorithms. Needed for access in the template. */
  learnAlgorithms: any = learningAlgorithm;

  @Output()
  registerMenu = new EventEmitter<any>();

  @Input()
  layoutSettings: any;

  @Input()
  result: LearnerResult;

  @Input()
  pointer: number;

  /** The enum for what is displayed in the panel. */
  modes: any = {
    HYPOTHESIS: 'HYPOTHESIS',
    OBSERVATION_TABLE: 'OBSERVATION_TABLE',
    DISCRIMINATION_TREE: 'DISCRIMINATION_TREE'
  };

  /** The mode that is used. */
  mode: string;

  constructor(private modalService: NgbModal,
              private promptService: PromptService,
              private downloadService: DownloadService,
              private element: ElementRef) {
    this.mode = this.modes.HYPOTHESIS;
  }

  ngOnInit(): void {
    this.registerDefaultMenu();
  }

  registerDefaultMenu(): void {
    this.registerMenu.emit([
      {
        text: 'Actions', children: [
          {text: 'Details', icon: 'fa-info', click: () => this.openResultDetailsModal()},
          {text: 'Layout', icon: 'fa-sliders-h', click: () => this.openHypothesisLayoutSettingsModal()},
          {divider: true},
          {text: 'Save as *.svg', icon: 'fa-save', click: () => this.exportHypothesisAsSvg()},
          {text: 'Save as *.json', icon: 'fa-save', click: () => this.exportHypothesisAsJson()},
          {text: 'Save as *.dot', icon: 'fa-save', click: () => this.exportHypothesisAsDot()}
        ]
      },
      {
        text: 'Data structure', children: [], click: () => this.showInternalDataStructure()
      }
    ]);
  }

  registerDtMenu(): void {
    this.registerMenu.emit([
        {
          text: 'Actions', children: [
            {text: 'Download SVG', icon: 'fa-download', click: () => this.exportDiscriminationTree()}
          ]
        },
        {
          text: 'Hypothesis', children: [], click: () => this.showHypothesis()
        }
      ]
    );
  }

  registerOtMenu(): void {
    this.registerMenu.emit([
      {
        text: 'Actions', children: [
          {text: 'Download CSV', icon: 'fa-download', click: () => this.exportObservationTable()}
        ]
      },
      {
        text: 'Hypothesis', children: [], click: () => this.showHypothesis()
      }
    ]);
  }

  /** Switches the mode to the one to display the internal data structure. */
  showInternalDataStructure(): void {
    switch (this.result.algorithm.name) {
      case learningAlgorithm.LSTAR:
        this.mode = this.modes.OBSERVATION_TABLE;
        this.registerOtMenu();
        break;
      case learningAlgorithm.DT:
        this.mode = this.modes.DISCRIMINATION_TREE;
        this.registerDtMenu();
        break;
      case learningAlgorithm.TTT:
        this.mode = this.modes.DISCRIMINATION_TREE;
        this.registerDtMenu();
        break;
      default:
        break;
    }
  }

  /** Downloads the currently displayed discrimination tree as svg. */
  exportDiscriminationTree(): void {
    const svg = this.element.nativeElement.querySelector('.discrimination-tree');
    this.promptService.prompt('Enter a name for the svg file')
      .then(filename => this.downloadService.downloadSvgEl(svg, true, filename));
  }

  /** Downloads the currently displayed hypothesis as svg. */
  exportHypothesisAsSvg(): void {
    const svg = this.element.nativeElement.querySelector('.hypothesis');
    this.promptService.prompt('Enter a name for the svg file')
      .then(filename => this.downloadService.downloadSvgEl(svg, true, filename));
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

  /** Switches the mode to the one to display the hypothesis. */
  showHypothesis(): void {
    this.mode = this.modes.HYPOTHESIS;
    this.registerDefaultMenu();
  }

  /** Downloads the currently displayed observation table. */
  exportObservationTable(): void {
    const table = this.element.nativeElement.querySelector('.observation-table');
    this.promptService.prompt('Enter a name for the csv file')
      .then(filename => this.downloadService.downloadTableEl(table, filename));
  }

  openResultDetailsModal(): void {
    const modalRef = this.modalService.open(LearnerResultDetailsModalComponent);
    modalRef.componentInstance.result = this.result;
    modalRef.componentInstance.current = this.pointer;
  }

  openHypothesisLayoutSettingsModal(): void {
    const modalRef = this.modalService.open(HypothesisLayoutSettingsModalComponent);
    modalRef.componentInstance.layoutSettings = JSON.parse(JSON.stringify(this.layoutSettings));
    modalRef.result.then(settings => this.layoutSettings = settings);
  }
}
