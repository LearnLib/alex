(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('discriminationTree', discriminationTree);

    /**
     * The directive for displaying a discrimination tree in an svg element. Can be used as an attribute or an element.
     * Expects another property 'data' which holds the string representation of the discrimination tree.
     *
     * Use it like: '<discrimination-tree data="...."></discrimination-tree>'
     *
     * @param _ - Lodash
     * @param d3 - D3
     * @param dagreD3 - dagreD3
     * @param graphlib - graphlib
     * @param $window - angular $window object
     * @returns {{scope: {data: string}, template: string, link: link}}
     */
    // @ngInject
    function discriminationTree(_, d3, dagreD3, graphlib, $window) {
        var template = '' +
            '<div class="discrimination-tree-wrapper">' +
            '   <svg><g></g></svg>' +
            '</div>';

        return {
            scope: {
                data: '='
            },
            template: template,
            link: link
        };

        function link(scope, el) {

            var labelStyle = 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline;';
            var labelStyleEdge = labelStyle + 'font-size: 10px';
            var labelStyleNode = labelStyle + 'font-size: 12px';

            // the svg where the discrimination tree is drawn into
            var svg = d3.select(el.find('svg')[0]);

            // the first g node of the svg for rendering
            var svgGroup = d3.select(el.find('svg').find('g')[0]);

            // the parent of the svg to fit its size accordingly
            var svgContainer = svg[0].parentNode;

            // render the new discrimination tree when property 'data' changes
            scope.$watch('data', function (newValue) {
                if (angular.isDefined(newValue)) {
                    var data = angular.fromJson(newValue);
                    var graph = createGraph(data);
                    var layoutedGraph = layout(graph);
                    render(layoutedGraph);
                }
            });

            /**
             * Creates a graph structure from a discrimination tree in order to layout it with the given dagreD3 library
             *
             * @param {Object} dt - The discrimination tree
             * @returns {{nodes: Array, edges: Array}} - The tree as graph representation
             */
            function createGraph(dt) {

                var nodes = [];
                var edges = [];

                function createGraphData(node, parent) {

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
                        nodes.push(node.discriminator)
                    }

                    if (parent !== null) {
                        edges.push({
                            from: parent.discriminator,
                            to: node.discriminator,
                            label: node.edgeLabel
                        });
                    }

                    _.forEach(node.children, function (child) {
                        if (child.data) {
                            nodes.push(child.data);
                            edges.push({
                                from: node.discriminator,
                                to: child.data,
                                label: child.edgeLabel
                            });
                        }
                    });

                    _.forEach(node.children, function (child) {
                        if (child.discriminator) {
                            createGraphData(child, node);
                        }
                    })
                }

                createGraphData(dt, null);

                return {
                    nodes: nodes,
                    edges: edges
                }
            }

            /**
             * Creates positions for nodes and edges of the discrimination tree that can be rendered with dagreD3
             *
             * @param {Object} graph - The discrimination tree as graph
             * @returns {exports.Graph} - The graph with positions of nodes
             */
            function layout(graph) {

                // initialize graph
                var _graph = new graphlib.Graph({
                    directed: true
                });
                _graph.setGraph({});

                // add nodes to the graph
                _.forEach(graph.nodes, function (node) {
                    _graph.setNode(node, {
                        shape: node[0] === 'q' ? 'rect' : 'circle',     // draw a rectangle when node is a leaf
                        label: node,
                        width: 25,
                        style: 'fill: #fff; stroke: #000; stroke-width: 1',
                        labelStyle: labelStyleNode
                    });
                });

                //add edges to the graph
                _.forEach(graph.edges, function (edge) {
                    _graph.setEdge(edge.from, edge.to, {
                        lineInterpolate: 'basis',
                        style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none",
                        label: edge.label,
                        labelStyle: labelStyleEdge
                    });
                });

                // layout
                dagreD3.dagre.layout(_graph, {});

                return _graph;
            }

            /**
             * Renders the discrimination tree in the svg with the dagreD3 library
             *
             * @param {exports.Graph} graph - The graph with position information
             */
            function render(graph) {

                // render the graph
                new dagreD3.render()(svgGroup, graph);

                // position it in the center of the svg parent
                var xCenterOffset = (svgContainer.clientWidth - graph.graph().width) / 2;
                svgGroup.attr("transform", "translate(" + xCenterOffset + ", 100)");

                // swap defs and paths children of .edgepaths because arrows are not shown
                // on export otherwise <.<
                _.forEach(el.find('svg')[0].querySelectorAll('.edgePath'), function (edgePath) {
                    edgePath.insertBefore(edgePath.childNodes[1], edgePath.firstChild);
                });

                // Create and handle zoom  & pan event
                var zoom = d3.behavior.zoom().scaleExtent([0.1, 10])
                    .translate([(svgContainer.clientWidth - graph.graph().width) / 2, 100]).on("zoom", zoomHandler);
                zoom(svg);

                function zoomHandler() {
                    svgGroup.attr('transform', 'translate(' + zoom.translate()
                    + ')' + ' scale(' + zoom.scale() + ')');
                }

                // resize the svg to its parents size on window resize
                // and call it once so that svg gets the proper dimensions
                $window.addEventListener('resize', fitSize);
                scope.$on('$destroy', function(){
                    $window.removeEventListener('resize', fitSize);
                });

                function fitSize() {
                    svg.attr("width", svgContainer.clientWidth);
                    svg.attr("height", svgContainer.clientHeight);
                }

                // in order to prevent only a white screen in some browsers, firing a resize event on the window
                // displays the svg contents
                window.setTimeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 100);
            }
        }
    }
}());