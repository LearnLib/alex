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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Edge as NgxGraphEdge, Node, NodePosition } from '@swimlane/ngx-graph';

@Component({
  selector: 'discrimination-tree',
  templateUrl: './discrimination-tree.component.html',
  styleUrls: ['./discrimination-tree.component.scss']
})
export class DiscriminationTreeComponent implements OnChanges {

  @Input()
  data: string;

  links: NgxGraphEdge[] = [];
  nodes: Node[] = [];
  layoutSettings = {
    orientation: 'TB'
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  init(): void {
    this.nodes = [];
    this.links = [];

    let i = 0; // for uniquely prefixing discriminators

    const buildTree = (dTree) => {
      if (dTree.discriminator) {
        dTree.discriminator = (i++) + '_' + dTree.discriminator;

        this.nodes.push({
          id: this.generateNodeId(dTree.discriminator),
          label: dTree.discriminator.replace(/^[0-9]+_/, '')
        });
      }

      if (dTree.data) { // node is a leaf
        dTree.data = (i++) + '_' + dTree.data;

        this.nodes.push({
          id: this.generateNodeId(dTree.data),
          label: dTree.data.replace(/^[0-9]+_/, '')
        });
      } else if (dTree.children) {
        dTree.children.forEach(buildTree);
        dTree.children.forEach(child => {
          const targetId = this.generateNodeId(child.discriminator ? child.discriminator : child.data);
          const sourceId = this.generateNodeId(dTree.discriminator);

          this.links.push({
            id: `link-${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
            label: child.edgeLabel
          });
        });
      }
    };

    buildTree(JSON.parse(this.data));
  }

  getMidPoint(link: NgxGraphEdge): NodePosition {
    if (link.points != null) {
      const i = Math.floor(link.points.length / 2);
      return link.points[i];
    } else {
      return {x: 0, y: 0};
    }
  }

  private generateNodeId(val: string) {
    return CSS.escape(val);
  }
}
