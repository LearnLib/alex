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

import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Edge as NgxGraphEdge, Node, NodePosition } from '@swimlane/ngx-graph';

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
export class HypothesisComponent implements OnChanges {

  @Output()
  selectEdge = new EventEmitter<Edge>();

  @Input()
  data: Hypothesis;

  @Input()
  layoutSettings: any;

  links: NgxGraphEdge[] = [];
  nodes: Node[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.firstChange || this.stateSizeChanged(changes) || this.alphabetChanged(changes)) {
      this.init();
    }

    this.cd.detectChanges();
  }

  private stateSizeChanged(changes: SimpleChanges): boolean {
    return changes.data.currentValue.nodes.length != changes.data.previousValue.nodes.length;
  }

  private alphabetChanged(changes: SimpleChanges): boolean {
    const curr = new Set(changes.data.currentValue.edges.map(e => e.input));
    const prev = new Set(changes.data.previousValue.edges.map(e => e.input));
    return curr.size != prev.size;
  }

  handleEdgeClick(link: NgxGraphEdge, label: string): void {
    const io = label.split(' / ');
    this.selectEdge.emit({
      from: link.source,
      to: link.target,
      input: io[0],
      output: io[1]
    });
  }

  init(): void {
    this.nodes = [];
    this.links = [];

    setTimeout(() => {
      this.nodes = this.data.nodes.map(node => ({
        id: node.toString(),
        label: node.toString()
      }));

      const edges = {};
      this.data.edges.forEach(edge => {
        if (edges[edge.from] == null) {edges[edge.from] = {};}
        if (edges[edge.from][edge.to] == null) {edges[edge.from][edge.to] = [];}
        edges[edge.from][edge.to].push(`${edge.input} / ${edge.output}`);
      });

      this.links = [];
      for (const from in edges) {
        for (const to in edges[from]) {
          this.links.push({
            id: `edge-${from}-${to}`,
            source: `${from}`,
            target: `${to}`,
            label: edges[from][to]
          });
        }
      }
    });
  }

  getMidPoint(link: NgxGraphEdge): NodePosition {
    if (link.points != null) {
      const i = Math.floor(link.points.length / 2);
      return link.points[i];
    } else {
      return {x: 0, y: 0};
    }
  }

  getNodeFill(node: Node): string {
      return node.id === '0' ? '#abdbb6': 'white';
  }

  getNodeStroke(node: Node): string {
    return node.id === '0' ? 'green': 'black';
  }
}
