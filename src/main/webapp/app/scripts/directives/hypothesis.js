(function () {

    angular.module('weblearner.directives')
        .directive('hypothesis', hypothesis);

    hypothesis.$inject = ['$window', 'paths', 'CounterExampleService', '_', 'dagreD3', 'd3', 'graphlib'];

    function intersectNode(node, point) {
        return node.intersect(point);
    }

    function calcPoints(g, e) {
        var edge = g.edge(e), tail = g.node(e.v), head = g.node(e.w), points = edge.points
            .slice(1, edge.points.length - 1);

        points.unshift(intersectNode(tail, points[0]));
        points.push(intersectNode(head, points[points.length - 1]));

        return createLine(edge, points);
    }

    function createLine(edge, points) {
        var line = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        });

        if (_.has(edge, "lineInterpolate")) {
            line.interpolate(edge.lineInterpolate);
        }

        if (_.has(edge, "lineTension")) {
            line.tension(Number(edge.lineTension));
        }

        return line(points);
    }

    function hypothesis($window, paths, CounterExampleService, _, dagreD3, d3, graphlib) {

        return {
            scope: {
                test: '=',
                layoutSettings: '=',
                isSelectable: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/hypothesis.html',
            link: link
        };

        function link(scope, el, attrs) {

            var _svg;
            var _svgGroup;
            var _svgContainer;
            var _graph;
            var _renderer;

            var labelStyle = 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline;';
            var labelStyleEdge = labelStyle + 'font-size: 10px';
            var labelStyleNode = labelStyle + 'font-size: 12px';

            scope.$watch('test', function (test) {
                if (angular.isDefined(test) && test != null) {
                    createHypothesis();
                }
            });

            scope.$watch('layoutSettings', function (ls) {
                if (angular.isDefined(ls)) {
                    createHypothesis();
                }
            });

            function createHypothesis() {
                clearSvg();
                initGraph();
                layout();
                renderGraph();
                handleEvents();
            }

            function clearSvg() {
                el.find('svg')[0].innerHTML = '';
            }

            function initGraph() {

                _svg = d3.select(el.find('svg')[0]);
                _svgGroup = _svg.append("g");
                _svgContainer = _svg.node().parentNode;

                _svg.style('font-family', '"Helvetica Neue",Helvetica,Arial,sans-serif');
                _svg.style('font-size', '12px');
                _svg.style('line-height', '1.42857');
                _svg.style('color', '#333');

                _graph = new graphlib.Graph({
                    directed: true,
                    multigraph: true
                });

                if (angular.isDefined(scope.layoutSettings)) {
                    _graph.setGraph({
                        edgesep: scope.layoutSettings.edgesep,
                        nodesep: scope.layoutSettings.nodesep,
                        ranksep: scope.layoutSettings.ranksep
                    });
                } else {
                    _graph.setGraph({
                        edgesep: 25
                    });
                }
            }

            function layout() {
                if (angular.isDefined(scope.layoutSettings)) {
                    if (scope.layoutSettings.multigraph) {
                        layoutAsMultiGraph();
                    } else {
                        layoutAsGraph();
                    }
                } else {
                    layoutAsGraph();
                }
            }

            function layoutAsMultiGraph() {

                // add nodes to the graph
                _.forEach(scope.test.hypothesis.nodes, function (node, i) {
                    var n = {
                        shape: 'circle',
                        label: node.toString(),
                        width: 25,
                        labelStyle: labelStyleNode
                    };

                    if (node === scope.test.hypothesis.initNode) {
                        n.style = 'fill: #B3E6B3; stroke: #5cb85c; stroke-width: 3';
                    } else {
                        n.style = 'fill: #fff; stroke: #000; stroke-width: 1';
                    }

                    _graph.setNode(node.toString(), n);
                });

                // add edges to the graph
                _.forEach(scope.test.hypothesis.edges, function (edge, i) {
                    var edgeName = edge.from + "-" + edge.to + "|" + i;
                    _graph.setEdge(edge.from, edge.to, {
                        label: edge.input + "/" + edge.output,
                        labeloffset: 5,
                        lineInterpolate: 'basis',
                        style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none",
                        labelStyle: labelStyleEdge
                    }, edgeName);
                });

                // layout it
                dagreD3.dagre.layout(_graph, {});
            }

            function layoutAsGraph() {

                // another format of a graph for merged multi edges
                // graph = {<from>: {<to>: <label[]>, ...}, ...}
                var graph = {};

                // add nodes to the rendered graph
                _.forEach(scope.test.hypothesis.nodes, function (node, i) {
                    var n = {
                        shape: 'circle',
                        label: node.toString(),
                        width: 25,
                        labelStyle: labelStyleNode
                    };

                    if (node === scope.test.hypothesis.initNode) {
                        n.style = 'fill: #B3E6B3; stroke: #5cb85c; stroke-width: 3';
                    } else {
                        n.style = 'fill: #fff; stroke: #000; stroke-width: 1';
                    }

                    _graph.setNode(node.toString(), n);
                });

                // build data structure for the alternative representation by
                // pushing some data
                _.forEach(scope.test.hypothesis.edges, function (edge) {
                    if (!graph[edge.from]) {
                        graph[edge.from] = {};
                        graph[edge.from][edge.to] = [edge.input + "/"
                        + edge.output];
                    } else {
                        if (!graph[edge.from][edge.to]) {
                            graph[edge.from][edge.to] = [edge.input + "/"
                            + edge.output];
                        } else {
                            graph[edge.from][edge.to].push(edge.input + "/"
                            + edge.output);
                        }
                    }
                });

                // add edges to the rendered graph and combine <label[]>
                _.forEach(graph, function (k, from) {
                    _.forEach(k, function (labels, to) {
                        _graph.setEdge(from, to, {
                            label: labels.join('\n'),
                            labeloffset: 5,
                            lineInterpolate: 'basis',
                            style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none",
                            labelStyle: labelStyleEdge
                        }, (from + '' + to));
                    });
                });

                // render the graph on the svg
                dagreD3.dagre.layout(_graph, {});
            }

            function renderGraph() {

                // render the graph in the svg
                _renderer = new dagreD3.render();
                _renderer(_svgGroup, _graph);

                // Center graph horizontally
                var xCenterOffset = (_svgContainer.clientWidth - _graph.graph().width) / 2;
                _svgGroup.attr("transform", "translate(" + xCenterOffset + ", 100)");

                // swap defs and paths children of .edgepaths because arrows are not shown
                // on export otherwise <.<
                _.forEach(el.find('svg')[0].querySelectorAll('.edgePath'), function(edgePath){
                    edgePath.insertBefore(edgePath.childNodes[1],edgePath.firstChild);
                })
            }

            function handleEvents() {

                var zoom;
                var drag;

                // attach click events for the selection of counter examples to the edge labels
                // only if counterExamples is defined
                if (angular.isDefined(scope.isSelectable)) {
                    _svg.selectAll('.edgeLabel tspan').on('click', function () {
                        var label = this.innerHTML.split('/');
                        scope.$apply(function () {
                            CounterExampleService.addIOPairToCurrentCounterexample(label[0], label[1]);
                        });
                    });
                }

                // Create and handle zoom  & pan event
                zoom = d3.behavior.zoom().scaleExtent([0.1, 10])
                    .translate([(_svgContainer.clientWidth - _graph.graph().width) / 2, 100]).on("zoom", zoomHandler);
                zoom(_svg);

                function zoomHandler() {
                    _svgGroup.attr('transform', 'translate(' + zoom.translate()
                    + ')' + ' scale(' + zoom.scale() + ')');
                }

                // Add drag behavior for nodes
                drag = d3.behavior.drag()
                    .origin(function (d) {
                        return d;
                    })
                    .on('dragstart', dragstart)
                    .on("drag", drag);

                _svg.selectAll('.node')
                    .attr('cx', function (d) {
                        return d.x;
                    })
                    .attr('cy', function (d) {
                        return d.y;
                    })
                    .call(drag);

                // prevent pan effect while dragging nodes
                function dragstart() {
                    d3.event.sourceEvent.stopPropagation();
                }

                function drag(d) {
                    var node = d3.select(this);
                    var attrs = _graph.node(d);
                    attrs.x += d3.event.dx;
                    attrs.y += d3.event.dy;
                    node.attr('transform', 'translate(' + attrs.x + ','
                    + attrs.y + ')');

                    // redraw edges
                    var paths = d3.selectAll('.path');
                    _.forEach(_graph.edges(), function (edge, i) {
                        var line = calcPoints(_graph, edge);
                        paths[0][i].setAttribute('d', line);
                    });
                }

                angular.element($window).on('resize', fitSize);

                function fitSize() {
                    _svg.attr("width", _svgContainer.clientWidth);
                    _svg.attr("height", _svgContainer.clientHeight);
                }

                window.setTimeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 100);
            }
        }
    }
}());