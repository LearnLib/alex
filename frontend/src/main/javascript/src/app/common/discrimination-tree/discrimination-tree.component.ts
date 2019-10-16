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

import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { dagre, graphlib, render as Renderer } from 'dagre-d3';

const STYLE = {
  edgeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 10px',
  nodeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 12px',
  edge: 'stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none',
  node: 'fill: #fff; stroke: #000; stroke-width: 1'
};

@Component({
  selector: 'discrimination-tree',
  templateUrl: './discrimination-tree.component.html',
  styleUrls: ['./discrimination-tree.component.scss']
})
export class DiscriminationTreeComponent implements OnDestroy, OnChanges, AfterViewInit {

  @Input()
  data: string;

  svg: any;
  svgGroup: any;
  svgContainer: any;
  renderer: any;
  graph: any;

  resizeHandler = this.fitSize.bind(this);

  constructor(private element: ElementRef) {
    this.renderer = new Renderer();
    this.graph = null;

    // resize the svg to its parents size on window resize
    // and call it once so that svg gets the proper dimensions
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.svg != null && this.data) {
      this.createGraph(JSON.parse(this.data));
      this.render();
    }
  }

  ngAfterViewInit(): void {
    const svg = this.element.nativeElement.querySelector('svg');
    this.svg = d3.select(svg);
    this.svgGroup = this.svg.select('g');
    this.svgContainer = svg.parentNode;
    this.render();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }

  fitSize(): void {
    this.svg.attr('width', this.svgContainer.clientWidth);
    this.svg.attr('height', this.svgContainer.clientHeight);
  }

  /**
   * Creates a graph structure from a discrimination tree in order to layout it with the given dagreD3 library.
   *
   * @param dt The discrimination tree.
   */
  createGraph(dt: any): void {
    this.graph = new graphlib.Graph({directed: true});
    this.graph.setGraph({});

    let i = 0; // for uniquely prefixing discriminators

    function createNode(node, shape) {
      return {
        shape,
        label: node.replace(/^[0-9]+_/, ''),
        width: 25,
        style: STYLE.node,
        labelStyle: STYLE.nodeLabel
      };
    }

    const self = this;

    function buildTree(dTree) {
      if (dTree.discriminator) {
        dTree.discriminator = (i++) + '_' + dTree.discriminator;
        self.graph.setNode(dTree.discriminator, createNode(dTree.discriminator, 'circle'));
      }

      if (dTree.data) { // node is a leaf
        dTree.data = (i++) + '_' + dTree.data;
        self.graph.setNode(dTree.data, createNode(dTree.data, 'rect'));
      } else if (dTree.children) {
        dTree.children.forEach(buildTree);
        dTree.children.forEach(child => {
          self.graph.setEdge(dTree.discriminator, child.discriminator ? child.discriminator : child.data, {
            style: STYLE.edge,
            label: child.edgeLabel,
            labelStyle: STYLE.edgeLabel,
            curve: d3.curveBasis
          });
        });
      }
    }

    buildTree(dt);

    dagre.layout(this.graph, {});
  }

  /**
   * Renders the discrimination tree in the svg with the dagreD3 library.
   */
  render(): void {
    if (this.graph == null) return;

    // Run the renderer. This is what draws the final graph.
    this.renderer(this.svgGroup, this.graph);

    // make that arrow heads are displayed in the exported svg
    this.svg.selectAll('.path').nodes().forEach((path) => {
      const markerId = '#' + path.getAttribute('marker-end').split(')')[0].split('#')[1];
      path.setAttribute('marker-end', `url(${markerId})`);
    });

    // zoom support
    const zoom = d3.zoom().on('zoom', () => {
      this.svgGroup.attr('transform', d3.event.transform);
    });
    zoom.scaleExtent([0.5, 3]);
    this.svg.call(zoom);

    // Center the graph
    const offsetX = (this.svg.attr('width') - this.graph.graph().width) / 2;
    this.svg.call(zoom.transform, d3.zoomIdentity.translate(offsetX, 20));

    // in order to prevent only a white screen in some browsers, firing a resize event on the window
    // displays the svg contents
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

}
