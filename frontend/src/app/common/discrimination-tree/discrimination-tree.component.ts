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

import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from '@hpcc-js/wasm';

@Component({
  selector: 'discrimination-tree',
  templateUrl: './discrimination-tree.component.html',
  styleUrls: ['./discrimination-tree.component.scss']
})
export class DiscriminationTreeComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  data: string;

  renderer: any;

  constructor(private hostEl: ElementRef) {
  }

  ngOnInit(): void {
    wasmFolder('/assets/@hpcc-js/wasm/dist/');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  ngOnDestroy() {
    this.renderer?.destroy();
  }

  init(): void {
    const nodes = [];
    const links = [];

    let id = 0;

    const buildTree = (dTree) => {
      if (dTree.id == null) {
        dTree.id = id++;
      }

      if (dTree.discriminator) {
        nodes.push(`${dTree.id} [shape="rectangle" label="${dTree.discriminator}"]`);
      }

      if (dTree.data) { // node is a leaf
        nodes.push(`${dTree.id} [shape="rectangle" label="${dTree.data}"]`);
      } else if (dTree.children) {
        dTree.children.forEach(child => {
          buildTree(child);
          links.push(`${dTree.id} -> ${child.id} [label="${child.edgeLabel}"]`);
        });
      }
    };

    buildTree(JSON.parse(this.data));

    const dot = `
      digraph hypothesis {
        ${nodes.join(';\n')}
        ${links.join(';\n')}
      }
    `;

    const graphEl = this.hostEl.nativeElement.querySelector('.graph');
    this.renderer = graphviz(graphEl);
    this.renderer.fit(true).renderDot(dot);
  }
}
