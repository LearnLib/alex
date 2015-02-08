(function(){

    angular
        .module('weblearner.directives')
        .directive('hypothesis', [
            '$window',
            hypothesis
        ]);

    function hypothesis ($window) {

        var directive = {
            scope: {
                test: '=',
                counterExample: '='
            },
            templateUrl: 'app/partials/directives/hypothesis.html',
            link: link
        };
        return directive;

        //////////

        function link (scope, el, attrs) {

            var _svg;
            var _svgGroup;
            var _svgContainer;
            var _graph;
            var _renderer;

            //////////

            scope.$watch('test', function(test){
                if (angular.isDefined(test) && test != null) {
                    if (angular.isDefined(_svg)){
                        el.find('svg')[0].innerHTML = '';
                    }
                    createHypothesis();
                }
            });

            //////////

            function createHypothesis () {
                initGraph();
                layoutGraph();
                renderGraph();
            }

            function initGraph() {

                _svg = d3.select(el.find('svg')[0]);
                _svgGroup = _svg.append("g");
                _svgContainer = _svg.node().parentNode;

                _graph = new graphlib.Graph({
                    directed: true,
                    multigraph: true
                });
                _graph.setGraph({edgesep: 25});
            }

            function layoutGraph() {

                _.forEach(scope.test.hypothesis.nodes, function (node, i) {
                    _graph.setNode("" + i, {shape: 'circle', label: node.toString(), width: 25});
                });

                _.forEach(scope.test.hypothesis.edges, function (edge, i) {
                    var edgeName =  edge.from + "-" + edge.to + "|" + i;
                    _graph.setEdge(edge.from, edge.to, {label: edge.input + "/" + edge.output, labeloffset: 5}, edgeName);
                });

                dagreD3.dagre.layout(_graph, {});
            }

            function renderGraph() {

                _renderer = new dagreD3.render();
                _renderer(_svgGroup, _graph);

                _svg.selectAll('.edgeLabel').on('click', function(){

                    var el = this.getElementsByTagName('tspan')[0];
                    var label = el.innerHTML.split('/');

                    scope.counterExample.input += (label[0] + ',');
                    scope.counterExample.output += (label[1] + ',');
                    scope.$apply()
                });

                // Center graph
                var xCenterOffset = (_svgContainer.clientWidth - _graph.graph().width) / 2;
                _svgGroup.attr("transform", "translate(" + xCenterOffset + ", 100)");

                // Create and handle zoom event
                var zoom = d3.behavior.zoom()
                    .scaleExtent([0.1, 10])
                    .translate([xCenterOffset, 100])
                    .on("zoom", zoomHandler);

                function zoomHandler() {
                    _svgGroup.attr('transform', 'translate(' + zoom.translate() + ')' + ' scale(' + zoom.scale() + ')');
                }

                // attach zoom event to svg g
                zoom(_svg);

                function fitSize() {
                    _svg.attr("width", _svgContainer.clientWidth);
                    _svg.attr("height", _svgContainer.clientHeight);
                }

                fitSize();

                angular.element($window).on('resize', fitSize);

                window.setTimeout(function(){
                    window.dispatchEvent(new Event('resize'));
                }, 100);
            }
        }
    }
}());