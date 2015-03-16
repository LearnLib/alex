(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('discriminationTree', discriminationTree);

    discriminationTree.$inject = ['_', '$window'];

    function discriminationTree(_, $window) {

        return {
            scope: {
                data: '='
            },
            template: '<svg><g></g></svg>',
            link: link
        }

        function link(scope, el, attrs) {

            var data = {
                discriminator: "w2 w3",
                children: [
                    {
                        discriminator: 'w3',
                        children: [
                            {data: 'q0'},
                            {data: 'q2'}
                        ]
                    },
                    {data: 'q1'}
                ]
            }

            var svg = d3.select(el.find('svg')[0]);
            var svgGroup = d3.select(el.find('svg').find('g')[0]);
            var svgContainer = el[0].parentNode;

            var graph = createGraph(data);
            var layoutedGraph = layout(graph);
            render(layoutedGraph);

            function createGraph(dt) {

                var nodes = [];
                var edges = [];

                function createGraphData(node, parent) {

                    if (node.children.length === 0) {
                        return;
                    }

                    if (!_.find(nodes, node.discriminator)) {
                        nodes.push(node.discriminator)
                    }

                    if (parent !== null) {
                        edges.push({
                            from: parent.discriminator,
                            to: node.discriminator
                        })
                    }

                    _.forEach(node.children, function(child){
                        if (child.data) {
                            nodes.push(child.data);
                            edges.push({
                                from: node.discriminator,
                                to: child.data
                            })
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

            function layout(graph){

                var _graph = new graphlib.Graph({
                    directed: true,
                });

                _graph.setGraph({})

                //// add nodes to the graph
                _.forEach(graph.nodes, function (node, i) {
                    _graph.setNode(node, {
                        shape: 'circle',
                        label: node,
                        width: 25,
                        style: 'fill: #fff; stroke: #000; stroke-width: 1',
                        labelStyle: 'font-size: 1.25em; font-weight: bold'
                    });
                });

                //add edges to the graph
                _.forEach(graph.edges, function (edge, i) {
                    _graph.setEdge(edge.from, edge.to, {
                        lineInterpolate: 'basis',
                        style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none"
                    });
                });

                // layout
                dagreD3.dagre.layout(_graph, {});

                return _graph;
            }

            function render(graph) {
                new dagreD3.render()(svgGroup, graph);

                var xCenterOffset = (svgContainer.clientWidth - graph.graph().width) / 2;
                svgGroup.attr("transform", "translate(" + xCenterOffset + ", 100)");

                // Create and handle zoom  & pan event
                var zoom = d3.behavior.zoom().scaleExtent([0.1, 10])
                    .translate([(svgContainer.clientWidth - graph.graph().width) / 2, 100]).on("zoom", zoomHandler);
                zoom(svg);

                function zoomHandler() {
                    svgGroup.attr('transform', 'translate(' + zoom.translate()
                    + ')' + ' scale(' + zoom.scale() + ')');
                }

                angular.element($window).on('resize', fitSize);

                function fitSize() {
                    svg.attr("width", svgContainer.clientWidth);
                    svg.attr("height", svgContainer.clientHeight);
                }

                window.setTimeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 100);
            }
        }
    }
}());