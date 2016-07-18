/*
 * Copyright 2016 TU Dortmund
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

import _ from "lodash";
import {graphlib, dagre, render as Renderer} from "dagre-d3";
import {events} from "../constants";

// various styles used to style the hypothesis
const STYLE = {
    edge: 'stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none',
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

/**
 * The component that is used to display hypotheses.
 *
 * Attribute 'isSelectable' should only be true if it should be possible to select input output pairs from the
 * hypothesis.
 *
 * Attribute 'layoutSettings' is optional.
 *
 * Use: <hypothesis data="..." is-selectable="true|false" layout-settings="..."></hypothesis>.
 */
class HypothesisComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param $element
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor($scope, $element, EventBus) {
        this.$scope = $scope;
        this.$element = $element;
        this.EventBus = EventBus;

        this.renderer = new Renderer();
        this.graph = null;

        this.svg = $element.find('svg')[0];
        this.svgGroup = $element.find('g')[0];
        this.svgContainer = this.svg.parentNode;

        this.resizeHandler = this.fitSize.bind(this);

        d3.select(this.svg).style(STYLE.svg);

        $scope.$watch('vm.data', data => {
            if (data) {
                this.data = data;
                this.init();
            }
        });

        $scope.$watch('vm.layoutSettings', settings => {
            if (settings) {
                this.layoutSettings = settings;
                this.init();
            }
        });

        $scope.$on('$destroy', () => {
            window.removeEventListener('resize', this.resizeHandler);
        });

        // do this whole stuff so that the size of the svg adjusts to the window
        window.addEventListener('resize', this.resizeHandler);

        this.init();
    }

    init() {
        this.layout();
        this.render();
        this.handleEvents();
    }

    /**
     * Adjust the size of the svg to the size of the visible container.
     */
    fitSize() {
        this.svg.setAttribute("width", this.svgContainer.clientWidth);
        this.svg.setAttribute("height", this.svgContainer.clientHeight);
    }

    /**
     * Layout the graph.
     */
    layout() {
        this.graph = new graphlib.Graph({
            directed: true,
            multigraph: true
        });

        if (this.layoutSettings !== null) {
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
            if (!graph[edge.from]) {
                graph[edge.from] = {};
                graph[edge.from][edge.to] = [edge.input + "/" + edge.output];
            } else {
                if (!graph[edge.from][edge.to]) {
                    graph[edge.from][edge.to] = [edge.input + "/" + edge.output];
                } else {
                    graph[edge.from][edge.to].push(edge.input + "/" + edge.output);
                }
            }
        });

        // add edges to the rendered graph and combine <label[]>
        _.forEach(graph, (k, from) => {
            _.forEach(k, (labels, to) => {
                this.graph.setEdge(from, to, {
                    label: labels.join('\n'),
                    labeloffset: 5,
                    lineInterpolate: 'basis',
                    style: STYLE.edge,
                    labelStyle: STYLE.edgeLabel
                }, (from + '' + to));
            });
        });

        // layout with dagre
        dagre.layout(this.graph, {});
    }

    /**
     * Render the graph to the svg.
     */
    render() {

        // clear the svg so that there aren't rendered multiple hypotheses
        this.svgGroup.innerHTML = '';

        // render the graph in the svg
        this.renderer(d3.select(this.svgGroup), this.graph);

        // Center graph horizontally
        const xCenterOffset = (this.svgContainer.clientWidth - this.graph.graph().width) / 2;
        this.svgGroup.setAttribute("transform", "translate(" + xCenterOffset + ", 100)");

        // swap defs and paths children of .edgepaths because arrows are not shown
        // on export otherwise <.<
        _.forEach(this.svg.querySelectorAll('.edgePath'), edgePath => {
            edgePath.insertBefore(edgePath.childNodes[1], edgePath.firstChild);
        });
    }

    /**
     * Create click and zoom events.
     */
    handleEvents() {
        const $scope = this.$scope;
        const EventBus = this.EventBus;

        // attach click events for the selection of counter examples to the edge labels
        // only if counterExamples is defined
        if (this.isSelectable) {
            d3.select(this.svg).selectAll('.edgeLabel tspan').on('click', function () {
                const label = this.innerHTML.split('/'); // separate abbreviation from output
                $scope.$apply(() => {
                    EventBus.emit(events.HYPOTHESIS_LABEL_SELECTED, {
                        input: label[0],
                        output: label[1]
                    });
                });
            });
        }

        // Create and handle zoom  & pan event
        const zoom = d3.behavior.zoom()
            .scaleExtent([0.1, 10])
            .translate([(this.svgContainer.clientWidth - this.graph.graph().width) / 2, 100])
            .on("zoom", () => {
                this.svgGroup.setAttribute('transform', `translate(${zoom.translate()}) scale(${zoom.scale()})`);
            });

        zoom(d3.select(this.svg));

        // prevent hypothesis not to be rendered instantly
        window.setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }
}

export const hypothesis = {
    template: `
        <div class="hypothesis-wrapper">
            <svg class="hypothesis">
                <g></g>
            </svg>
        </div>
    `,
    bindings: {
        data: '=',
        layoutSettings: '=',
        isSelectable: '@'
    },
    controller: HypothesisComponent,
    controllerAs: 'vm'
};