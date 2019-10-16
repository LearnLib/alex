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
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';

import * as d3 from 'd3';
import { dagre, graphlib, render as Renderer } from 'dagre-d3';
import { forEach } from 'lodash';
import { EventBus } from '../../services/eventbus.service';

// various styles used to style the hypothesis
const STYLE = {
  edge: 'stroke: red; stroke-width: 5; fill: none',
  edgeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 10px; fill: red',
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

@Component({
  selector: 'hypothesis',
  templateUrl: './hypothesis.component.html',
  styleUrls: ['./hypothesis.component.scss']
})
export class HypothesisComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  @Input()
  public data: any;

  @Input()
  public layoutSettings: any;

  @Input()
  public isSelectable: boolean;

  public renderer: any;
  public graph: any;
  public edgeData: any;
  public svg: any;
  public svgGroup: any;
  public svgContainer: any;
  public resizeHandler: any;

  constructor(private element: ElementRef,
              private eventBus: EventBus) {

    this.renderer = new Renderer();
    this.graph = null;

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
    this.fitSize();
    this.layout();
    this.render();
    this.handleEvents();

    const diffs = [["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Drive 150", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Drive 60", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Release Break", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Break", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 120", "Break", "Add Vehicle Slow", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 80", "Drive 120", "Remove Vehicle", ], ["Add Vehicle Slow", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Add Vehicle Fast", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Drive 120", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 150", "Add Vehicle Fast", "Disable", "Enable", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Drive 80", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 80", "Drive 150", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Release Break", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Drive 150", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 150", "Disable", "Enable", "Add Vehicle Fast", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 150", "Break", "Release Break", "Enable", "Add Vehicle Fast", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Release Break", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Disable", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Remove Vehicle", "Drive 150", "Add Vehicle Slow", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Drive 150", "Disable", "Enable", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Drive 80", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Drive 150", "Remove Vehicle", ], ["Enable", "Add Vehicle Slow", "Drive 150", "Disable", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Drive 150", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Drive 150", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Fast", "Remove Vehicle", ], ["Break", "Drive 150", "Add Vehicle Slow", "Break", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Drive 80", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 150", "Add Vehicle Slow", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Drive 120", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Drive 150", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 60", "Drive 120", "Remove Vehicle", ], ["Break", "Drive 150", "Add Vehicle Fast", "Add Vehicle Slow", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Add Vehicle Fast", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Drive 80", "Enable", "Drive 150", "Add Vehicle Fast", "Disable", "Enable", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 60", "Drive 150", "Add Vehicle Fast", "Disable", "Enable", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Drive 150", "Remove Vehicle", "Add Vehicle Fast", "Disable", "Enable", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Drive 120", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 80", "Enable", "Drive 150", "Disable", "Enable", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 60", "Break", "Add Vehicle Slow", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Break", "Add Vehicle Slow", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 60", "Add Vehicle Slow", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Drive 150", "Disable", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Drive 120", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 150", "Remove Vehicle", "Add Vehicle Fast", "Disable", "Enable", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Drive 60", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Drive 150", "Break", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 150", "Release Break", "Add Vehicle Fast", "Disable", "Enable", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Fast", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 150", "Drive 150", "Add Vehicle Fast", "Disable", "Enable", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Break", "Drive 150", "Add Vehicle Slow", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Add Vehicle Fast", "Remove Vehicle", ], ["Drive 150", "Add Vehicle Slow", "Break", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 120", "Add Vehicle Slow", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Break", "Drive 150", "Add Vehicle Slow", "Enable", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Drive 80", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Drive 60", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Drive 120", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Break", "Drive 150", "Add Vehicle Slow", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Break", "Drive 80", "Add Vehicle Slow", "Drive 150", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Drive 120", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Drive 150", "Break", "Release Break", "Enable", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Remove Vehicle", ], ["Break", "Drive 150", "Add Vehicle Slow", "Add Vehicle Slow", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Break", "Drive 150", "Add Vehicle Slow", "Disable", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Drive 150", "Add Vehicle Fast", "Disable", "Enable", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Break", "Drive 150", "Add Vehicle Slow", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 120", "Drive 120", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 60", "Add Vehicle Fast", "Drive 150", "Disable", "Enable", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Remove Vehicle", "Drive 150", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Drive 150", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 80", "Add Vehicle Slow", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Disable", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Drive 150", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Release Break", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 60", "Drive 150", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Drive 150", "Disable", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Disable", "Drive 150", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 60", "Add Vehicle Slow", "Drive 60", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Drive 150", "Add Vehicle Slow", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 150", "Add Vehicle Slow", "Disable", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Drive 150", "Drive 150", "Disable", "Enable", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 150", "Enable", "Add Vehicle Slow", "Drive 80", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Drive 150", "Remove Vehicle", ], ["Drive 150", "Add Vehicle Slow", "Release Break", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Drive 150", "Enable", "Add Vehicle Fast", "Disable", "Enable", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Drive 150", "Release Break", "Disable", "Enable", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Drive 150", "Break", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Enable", "Add Vehicle Slow", "Drive 150", "Break", "Release Break", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Add Vehicle Fast", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 80", "Add Vehicle Slow", "Release Break", "Remove Vehicle", ], ["Drive 150", "Enable", "Drive 120", "Add Vehicle Slow", "Remove Vehicle", ], ["Drive 120", "Enable", "Add Vehicle Fast", "Drive 150", "Enable", "Disable", "Enable", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Disable", "Drive 80", "Drive 150", "Enable", "Remove Vehicle", ], ["Drive 150", "Add Vehicle Slow", "Drive 150", "Enable", "Remove Vehicle", ], ["Add Vehicle Fast", "Drive 150", "Enable", "Release Break", "Remove Vehicle", ], ["Drive 60", "Enable", "Add Vehicle Slow", "Break", "Drive 150", "Enable", "Release Break", "Enable", "Remove Vehicle", ], ];
    diffs.forEach(diff => this.highlightWord(diff, "green"));
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
        const text = document.createElementNS('http://www.w3.org/2000/svg','text');
        labels.forEach(l => {
          const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
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
    const eventBus = this.eventBus;

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
    if (this.isSelectable) {
      this.svg.selectAll('.edgeLabel tspan').on('click', function (d) {
        const edges = self.edgeData[d.v][d.w];
        const edge = edges.filter(e => (e.input + ' / ' + e.output) === this.textContent)[0];
        eventBus.hypothesisLabelSelected$.next({input: edge.input, output: edge.output});
      });
    }
  }

}
