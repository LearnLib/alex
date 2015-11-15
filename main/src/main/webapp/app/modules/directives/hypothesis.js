import {_, d3, dagreD3, graphlib} from '../libraries';
import {events} from '../constants';

/**
 * The directive that is used to display hypotheses.
 *
 * Attribute 'isSelectable' should only be true if it should be possible to select input output pairs from the
 * hypothesis
 *
 * Attribute 'layoutSettings' is optional.
 *
 * Use: <hypothesis test="..." is-selectable="true|false" layout-settings="..."></hypothesis>
 *
 * @param $window
 * @param EventBus
 * @returns {{scope: {result: string, layoutSettings: string, isSelectable: string}, template: string, link: link}}
 */
// @ngInject
function hypothesis($window, EventBus) {
    return {
        scope: {
            result: '=',
            layoutSettings: '=',
            isSelectable: '@'
        },
        template: `
                <div class="hypothesis-wrapper">
                    <svg class="hypothesis"></svg>
                </div>
            `,
        link: link
    };
    function link(scope, el) {
        var _svg;               // the svg element
        var _svgGroup;          // the first g element in the svg the hypothesis is rendered into
        var _svgContainer;      // the parent of the svg element
        var _graph;             // the graphlib graph object that represents the hypothesis
        var _renderer;          // the dagreD3 renderer that renders _graph in _svgGroup

        var styles = {
            edge: 'stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none',
            edgeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 10px',
            nodeLabel: 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; font-size: 12px',
            node: 'fill: #fff; stroke: #000; stroke-width: 1',
            initNode: 'fill: #B3E6B3; stroke: #5cb85c; stroke-width: 3'
        };

        scope.$watch('result', function (result) {
            if (angular.isDefined(result) && result !== null) {
                createHypothesis();
            }
        });

        scope.$watch('layoutSettings', function (ls) {
            if (angular.isDefined(ls)) {
                createHypothesis();
            }
        });

        // create the hypothesis. Call this on re-render
        function createHypothesis() {
            clearSvg();
            init();
            layout();
            render();
            handleEvents();
        }

        function clearSvg() {
            el.find('svg')[0].innerHTML = '';
        }

        function init() {
            _svg = d3.select(el.find('svg')[0]);
            _svgGroup = _svg.append("g");
            _svgContainer = _svg.node().parentNode;

            _svg.style({
                'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif',
                'font-size': '12px',
                'line-height': '1.42857',
                'color': '#333'
            });

            _graph = new graphlib.Graph({
                directed: true,
                multigraph: true
            });

            if (scope.layoutSettings !== null) {
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
            function createEdgeObject(label) {
                return {
                    label: label,
                    labeloffset: 5,
                    lineInterpolate: 'basis',
                    style: styles.edge,
                    labelStyle: styles.edgeLabel
                }
            }

            // add nodes to the graph
            for (var i = 0; i < scope.result.hypothesis.nodes.length; i++) {
                let node = scope.result.hypothesis.nodes[i];
                _graph.setNode(node.toString(), {
                    shape: 'circle',
                    label: node.toString(),
                    width: 25,
                    labelStyle: styles.nodeLabel,
                    style: node === scope.result.hypothesis.initNode ? styles.initNode : styles.node
                })
            }

            // another format of a graph for merged multi edges
            // graph = {<from>: {<to>: <label[]>, ...}, ...}
            var graph = {};

            // build data structure for the alternative representation by
            // pushing some data
            _.forEach(scope.result.hypothesis.edges, function (edge) {
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
            _.forEach(graph, function (k, from) {
                _.forEach(k, function (labels, to) {
                    _graph.setEdge(from, to, createEdgeObject(labels.join('\n')), (from + '' + to));
                });
            });

            // layout with dagre
            dagreD3.dagre.layout(_graph, {});
        }

        function render() {

            // render the graph in the svg
            _renderer = new dagreD3.render();
            _renderer(_svgGroup, _graph);

            // Center graph horizontally
            var xCenterOffset = (_svgContainer.clientWidth - _graph.graph().width) / 2;
            _svgGroup.attr("transform", "translate(" + xCenterOffset + ", 100)");

            // swap defs and paths children of .edgepaths because arrows are not shown
            // on export otherwise <.<
            _.forEach(el.find('svg')[0].querySelectorAll('.edgePath'), function (edgePath) {
                edgePath.insertBefore(edgePath.childNodes[1], edgePath.firstChild);
            })
        }

        function handleEvents() {

            // attach click events for the selection of counter examples to the edge labels
            // only if counterExamples is defined
            if (angular.isDefined(scope.isSelectable)) {
                _svg.selectAll('.edgeLabel tspan').on('click', function () {
                    const label = this.innerHTML.split('/'); // separate abbreviation from output
                    scope.$apply(() => {
                        EventBus.emit(events.HYPOTHESIS_LABEL_SELECTED, {
                            input: label[0],
                            output: label[1]
                        })
                    });
                });
            }

            // Create and handle zoom  & pan event
            const zoom = d3.behavior.zoom()
                .scaleExtent([0.1, 10])
                .translate([(_svgContainer.clientWidth - _graph.graph().width) / 2, 100])
                .on("zoom", () => {
                    _svgGroup.attr('transform', 'translate(' + zoom.translate()
                        + ')' + ' scale(' + zoom.scale() + ')');
                });

            zoom(_svg);

            // do this whole stuff so that the size of the svg adjusts to the window
            $window.addEventListener('resize', fitSize);
            scope.$on('$destroy', () => {
                $window.removeEventListener('resize', fitSize);
            });

            function fitSize() {
                _svg.attr("width", _svgContainer.clientWidth);
                _svg.attr("height", _svgContainer.clientHeight);
            }

            // prevent hypothesis not to be rendered instantly
            window.setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        }
    }
}

export default hypothesis;