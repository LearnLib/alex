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

import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';

import * as d3 from 'd3';
import { dagre, graphlib, render as Renderer } from 'dagre-d3';
import { forEach } from 'lodash';

// various styles used to style the hypothesis
const STYLE = {
  edge: 'stroke: rgba(0, 0, 0, 0.2); stroke-width: 5; fill: none',
  edgeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 10px',
  nodeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 12px',
  node: 'fill: #fff; stroke: #000; stroke-width: 1',
  initNode: 'fill: #B3E6B3; stroke: #5cb85c; stroke-width: 3',
  svg: {
    'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif',
    'font-size': '12px',
    'line-height': '1.42857',
    'color': '#333'
  }
};

export interface Edge {
  from: string,
  to: string,
  input: string,
  output: string
}

@Component({
  selector: 'hypothesis',
  templateUrl: './hypothesis.component.html',
  styleUrls: ['./hypothesis.component.scss']
})
export class HypothesisComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Output()
  selectEdge = new EventEmitter<Edge>();

  @Input()
  data: any;

  @Input()
  layoutSettings: any;

  rendering: boolean;

  renderer: any;
  graph: any;
  edgeData: any;
  svg: any;
  svgGroup: any;
  svgContainer: any;
  resizeHandler: any;

  constructor(private element: ElementRef) {

    this.renderer = new Renderer();
    this.graph = null;
    this.rendering = false;

    // from -> (to -> edge)
    // needed so that we get the correct input output on edge label click
    this.edgeData = {};

    this.resizeHandler = this.fitSize.bind(this);
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.resizeHandler);
  }

  ngAfterViewInit(): void {
    const svg = this.element.nativeElement.querySelector('svg');
    this.svg = d3.select(svg);
    this.svg.style(STYLE.svg);
    this.svgGroup = this.svg.select('g');
    this.svgContainer = svg.parentNode;
    this.init();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.svg != null) {
      this.init();
    }
  }

  init(): void {
    this.svgGroup.html('');
    this.rendering = true;
    this.fitSize();
    window.setTimeout(() => {
      this.layout();
      this.render();
      this.handleEvents();
      this.rendering = false;
    }, 0);
  }

  /**
   * Adjust the size of the svg to the size of the visible container.
   */
  fitSize(): void {
    this.svg.attr('width', this.svgContainer.clientWidth);
    this.svg.attr('height', this.svgContainer.clientHeight);
  }

  highlightWord(word, color): void {
    let current = this.graph.node(this.data.initNode);
    for (let i = 0; i < word.length; i++) {
      this.highlightEdge(current.label, word[i], color);
      current = this.nextNode(current.label, word[i]);
    }
  }

  highlightEdge(from, input, color): void {
    const edgeLabels = this.element.nativeElement.querySelectorAll(`tspan[data-from="${from}"]`);
    edgeLabels.forEach(label => {
      if (label.textContent.split(' / ')[0].trim().startsWith(input.trim())) {
        const to = label.getAttribute('data-to');
        const edge = this.element.nativeElement.querySelector(`#edge-${from}-${to} path`);
        label.style.fill = color;
        edge.style.stroke = color;
      }
    });
  }

  nextNode(from: string, input: string): any {
    const edgeLabels = this.element.nativeElement.querySelectorAll(`tspan[data-from="${from}"]`);
    for (let label of edgeLabels) {
      if (label.textContent.split(' / ')[0].trim().startsWith(input.trim())) {
        const to = label.getAttribute('data-to');
        return this.graph.node(to);
      }
    }
    return null;
  }

  /**
   * Layout the graph.
   */
  layout(): void {
    this.graph = new graphlib.Graph({
      directed: true,
      multigraph: true
    });

    if (this.layoutSettings != null) {
      this.graph.setGraph({
        edgesep: this.layoutSettings.edgesep,
        nodesep: this.layoutSettings.nodesep,
        ranksep: this.layoutSettings.ranksep
      });
    } else {
      this.graph.setGraph({
        edgesep: 25
      });
    }

    // add nodes to the graph
    this.data.nodes.forEach(node => {
      this.graph.setNode(node.toString(), {
        shape: 'circle',
        label: node.toString(),
        width: 25,
        labelStyle: STYLE.nodeLabel,
        style: node === this.data.initNode ? STYLE.initNode : STYLE.node
      });
    });

    // another format of a graph for merged multi edges
    // graph = {<from>: {<to>: <label[]>, ...}, ...}
    const graph = {};

    // build data structure for the alternative representation by
    // pushing some data
    this.data.edges.forEach(edge => {
      if (this.edgeData[edge.from] == null) {
        this.edgeData[edge.from] = {};
      }
      if (this.edgeData[edge.from][edge.to] == null) {
        this.edgeData[edge.from][edge.to] = [];
      }
      this.edgeData[edge.from][edge.to].push(edge);

      if (!graph[edge.from]) {
        graph[edge.from] = {};
        graph[edge.from][edge.to] = [edge.input + ' / ' + edge.output];
      } else {
        if (!graph[edge.from][edge.to]) {
          graph[edge.from][edge.to] = [edge.input + ' / ' + edge.output];
        } else {
          graph[edge.from][edge.to].push(edge.input + ' / ' + edge.output);
        }
      }
    });

    // add edges to the rendered graph and combine <label[]>
    forEach(graph, (k, from) => {
      forEach(k, (labels: any[], to) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labels.forEach(l => {
          const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          tspan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
          tspan.setAttribute('dy', '1em');
          tspan.setAttribute('x', '1');
          tspan.setAttribute('data-from', from);
          tspan.setAttribute('data-to', `${to}`);
          tspan.textContent = l;
          text.appendChild(tspan);
        });

        this.graph.setEdge(from, to, {
          id: 'edge-' + from + '-' + to,
          labelType: 'svg',
          label: text,
          labeloffset: 5,
          style: STYLE.edge,
          labelStyle: STYLE.edgeLabel,
          curve: d3.curveBasis
        }, (from + '' + to));
      });
    });

    // layout with dagre
    dagre.layout(this.graph, {});
  }

  /**
   * Render the graph to the svg.
   */
  render(): void {
    // clear the svg so that there aren't rendered multiple hypotheses
    this.svgGroup.html('');

    // Run the renderer. This is what draws the final graph.
    this.renderer(this.svgGroup, this.graph);

    // make that arrow heads are displayed in the exported svg
    this.svg.selectAll('.path').nodes().forEach((path) => {
      const markerId = '#' + path.getAttribute('marker-end').split(')')[0].split('#')[1];
      path.setAttribute('marker-end', `url(${markerId})`);
    });

    // in order to prevent only a white screen in some browsers, firing a resize event on the window
    // displays the svg contents
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  /**
   * Create click and zoom events.
   */
  handleEvents(): void {

    // zoom support
    const zoom = d3.zoom().on('zoom', () => {
      this.svgGroup.attr('transform', d3.event.transform);
    });
    zoom.scaleExtent([0.1, 3]);
    this.svg.call(zoom);

    // Center the graph
    const offsetX = (this.svg.attr('width') - this.graph.graph().width) / 2;
    this.svg.call(zoom.transform, d3.zoomIdentity.translate(offsetX, 20));

    // attach click events for the selection of counter examples to the edge labels
    // only if counterexamples is defined
    const self = this;
    this.svg.selectAll('.edgeLabel tspan').on('click', function (d) {
      const from = this.getAttribute('data-from');
      const to = this.getAttribute('data-to');
      const edges = self.edgeData[from][to];
      const edge = edges.filter(e => (e.input + ' / ' + e.output) === this.textContent)[0];

      self.selectEdge.emit({
        from,
        to,
        input: edge.input,
        output: edge.output
      });
    });
  }
}
