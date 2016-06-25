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
import d3 from "d3/d3";

const STYLE = {
    edgeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 10px',
    nodeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 12px',
    edge: 'stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none',
    node: 'fill: #fff; stroke: #000; stroke-width: 1'
};

/**
 * The component for displaying a discrimination tree in an svg element.
 * Expects another property 'data' which holds the string representation of the discrimination tree.
 *
 * Use it like: '<discrimination-tree data="...."></discrimination-tree>'
 */
class DiscriminationTreeComponent {

    /**
     * Constructor.
     * @param $scope
     * @param $element
     */
    // @ngInject
    constructor($scope, $element) {

        // the svg where the discrimination tree is drawn into
        this.svg = $element.find('svg')[0];

        // the first g node of the svg for rendering
        this.svgGroup = $element.find('g')[0];

        // the parent of the svg to fit its size accordingly
        this.svgContainer = this.svg.parentNode;

        this.renderer = new Renderer();

        this.graph = null;

        // render the new discrimination tree when property 'data' changes
        $scope.$watch('vm.data', data => {
            if (data) {
                const graph = this.createGraph(angular.fromJson(data));
                this.layout(graph);
                this.render();
            }
        });

        const resizeHandler = this.fitSize.bind(this);

        // resize the svg to its parents size on window resize
        // and call it once so that svg gets the proper dimensions
        window.addEventListener('resize', resizeHandler);

        $scope.$on('$destroy', () => {
            window.removeEventListener('resize', resizeHandler);
        });
    }

    fitSize() {
        this.svg.setAttribute("width", this.svgContainer.clientWidth);
        this.svg.setAttribute("height", this.svgContainer.clientHeight);
    }

    /**
     * Creates a graph structure from a discrimination tree in order to layout it with the given dagreD3 library
     *
     * @param {Object} dt - The discrimination tree
     * @returns {{nodes: Array, edges: Array}} - The tree as graph representation
     */
    createGraph(dt) {
        const nodes = [];
        const edges = [];

        const createGraphData = (node, parent) => {

            // root without children
            if (!node.children && parent === null) {
                nodes.push(node.data);
                return;
            }

            // is leaf?
            if (node.children.length === 0) {
                return;
            }

            // add node if not exists
            if (!_.find(nodes, node.discriminator)) {
                nodes.push(node.discriminator);
            }

            if (parent !== null) {
                edges.push({
                    from: parent.discriminator,
                    to: node.discriminator,
                    label: node.edgeLabel
                });
            }

            node.children.forEach(child => {
                if (child.data) {
                    nodes.push(child.data);
                    edges.push({
                        from: node.discriminator,
                        to: child.data,
                        label: child.edgeLabel
                    });
                }
            });

            node.children.forEach(child => {
                if (child.discriminator) createGraphData(child, node);
            });
        };

        createGraphData(dt, null);

        return {
            nodes: nodes,
            edges: edges
        };
    }

    /**
     * Creates positions for nodes and edges of the discrimination tree that can be rendered with dagreD3
     *
     * @param {Object} graph - The discrimination tree as graph
     */
    layout(graph) {

        // initialize graph
        this.graph = new graphlib.Graph({
            directed: true
        });
        this.graph.setGraph({});

        // add nodes to the graph
        graph.nodes.forEach(node => {
            this.graph.setNode(node, {
                shape: node[0] === 'q' ? 'rect' : 'circle',     // draw a rectangle when node is a leaf
                label: node,
                width: 25,
                style: STYLE.node,
                labelStyle: STYLE.nodeLabel
            });
        });

        //add edges to the graph
        graph.edges.forEach(edge => {
            this.graph.setEdge(edge.from, edge.to, {
                lineInterpolate: 'basis',
                style: STYLE.edge,
                label: edge.label,
                labelStyle: STYLE.edgeLabel
            });
        });

        // layout
        dagre.layout(this.graph, {});
    }

    /**
     * Renders the discrimination tree in the svg with the dagreD3 library.
     */
    render() {

        // render the graph
        this.renderer(d3.select(this.svgGroup), this.graph);

        // position it in the center of the svg parent
        const xCenterOffset = (this.svgContainer.clientWidth - this.graph.graph().width) / 2;
        this.svgGroup.setAttribute("transform", "translate(" + xCenterOffset + ", 100)");

        // swap defs and paths children of .edgepaths because arrows are not shown
        // on export otherwise <.<
        _.forEach(this.svg.querySelectorAll('.edgePath'), edgePath => {
            edgePath.insertBefore(edgePath.childNodes[1], edgePath.firstChild);
        });

        const zoomHandler = () => {
            this.svgGroup.setAttribute('transform', `translate(${zoom.translate()}) scale(${zoom.scale()})`);
        };

        // Create and handle zoom  & pan event
        const zoom = d3.behavior.zoom().scaleExtent([0.1, 10])
            .translate([(this.svgContainer.clientWidth - this.graph.graph().width) / 2, 100])
            .on("zoom", zoomHandler);

        zoom(d3.select(this.svg));

        // in order to prevent only a white screen in some browsers, firing a resize event on the window
        // displays the svg contents
        window.setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }
}

export const discriminationTree = {
    template: `
        <div class="discrimination-tree-wrapper">
            <svg>
                <g></g>
            </svg>
        </div>
    `,
    controller: DiscriminationTreeComponent,
    controllerAs: 'vm',
    bindings: {
        data: '='
    }
};