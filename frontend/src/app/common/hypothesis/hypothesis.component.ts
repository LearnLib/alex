/*
 * Copyright 2015 - 2021 TU Dortmund
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

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { graphviz } from 'd3-graphviz';
import { wasmFolder } from '@hpcc-js/wasm';
import * as d3 from 'd3';

export interface Edge {
  from: string;
  to: string;
  input: string;
  output: string;
}

export interface Hypothesis {
  nodes: number[];
  initNode: number;
  edges: Edge[];
}

@Component({
  selector: 'hypothesis',
  templateUrl: './hypothesis.component.html',
  styleUrls: ['./hypothesis.component.scss']
})
export class HypothesisComponent implements OnInit, OnChanges, OnDestroy {

  @Output()
  selectEdge = new EventEmitter<Edge>();

  @Input()
  data: Hypothesis;

  @Input()
  layoutSettings: any;

  renderer: any;

  constructor(private cd: ChangeDetectorRef, private hostEl: ElementRef) {
  }

  ngOnInit(): void {
    wasmFolder('/assets/@hpcc-js/wasm/dist/');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.firstChange || this.stateSizeChanged(changes) || this.alphabetChanged(changes)) {
      this.init();
    }

    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.renderer?.destroy();
  }

  handleEdgeClick(label: string): void {
    const io = label.split(' / ');
    this.selectEdge.emit({
      from: null,
      to: null,
      input: io[0],
      output: io[1]
    });
  }

  init(): void {
    setTimeout(() => {
      // combine edges
      const edges = {};
      this.data.edges.forEach(edge => {
        if (edges[edge.from] == null) {
          edges[edge.from] = {};
        }
        if (edges[edge.from][edge.to] == null) {
          edges[edge.from][edge.to] = [];
        }
        edges[edge.from][edge.to].push(`${edge.input} / ${edge.output}`);
      });

      const links = [];
      for (const from in edges) {
        if (edges.hasOwnProperty(from)) {
          for (const to in edges[from]) {
            if (edges[from].hasOwnProperty(to)) {
              links.push(`${from} -> ${to} [label="${edges[from][to].join('\n')}"]`);
            }
          }
        }
      }

      const nodes = this.data.nodes
        .map(node => `${node.toString()} [shape="circle" label="${node.toString()}"]`)

      const dot = `
        digraph hypothesis {
          __start0 [label="" shape="none"];
          __start0 -> 0;
          ${nodes.join(';\n')}
          ${links.join(';\n')}
        }
      `;

      const graphEl = this.hostEl.nativeElement.querySelector('.graph');
      this.renderer = graphviz(graphEl);
      this.renderer.fit(true).renderDot(dot).on('end', () => {
        d3.select(graphEl.querySelector('svg')).selectAll('.edge text').on('click', (e) => {
          this.handleEdgeClick(e.target.textContent);
        })
      });
    });
  }

  private stateSizeChanged(changes: SimpleChanges): boolean {
    return changes.data.currentValue.nodes.length !== changes.data.previousValue.nodes.length;
  }

  private alphabetChanged(changes: SimpleChanges): boolean {
    const curr = new Set(changes.data.currentValue.edges.map(e => e.input));
    const prev = new Set(changes.data.previousValue.edges.map(e => e.input));
    return curr.size !== prev.size;
  }
}
