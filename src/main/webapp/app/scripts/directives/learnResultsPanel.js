(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('learnResultsPanel', learnResultsPanel)
        .directive('learnResultsSlideshowPanel', learnResultsSlideshowPanel);

    learnResultsPanel.$inject = ['paths', 'learnAlgorithms'];
    learnResultsSlideshowPanel.$inject = ['paths'];

    /**
     * The directive that displays a browsable list of learn results. For each result, it can display the observation
     * table, if L* was used, or the Discrimination Tree from the corresponding algorithm.
     *
     * It expects an attribute 'results' which should contain a list of the learn results that should be displayed. It
     * can for example be the list of all intermediate results of a complete test or multiple single results from
     * multiple tests.
     *
     * The second attribute 'index' is optional and should only be used if multiple learnResultPanels are created in
     * a ng-repeat loop in order to be able to download the internal data structures. Give it the value of scope.$index
     * in the loop.
     *
     * Content that is written inside the tag will be displayed a the top left corner beside the index browser. So
     * just add small texts or additional buttons in there.
     *
     * Use it like '<learn-results-panel results="..."> ... </learn-results-panel>'
     *
     * @param {Object} paths - The constant for application paths
     * @param {Object} learnAlgorithms - The constant for available learn algorithms
     * @returns {{scope: {results: string}, transclude: boolean, templateUrl: string, controller: *[]}}
     */
    function learnResultsPanel(paths, learnAlgorithms) {
        return {
            scope: {
                results: '=',
                index: '@'
            },
            transclude: true,
            templateUrl: paths.views.DIRECTIVES + '/learn-results-panel.html',
            controller: ['$scope', controller]
        };

        function controller($scope) {

            /**
             * Enum for displayable modes.
             * 0 := show hypothesis
             * 1 := show internal data structure
             * @type {{HYPOTHESIS: number, INTERNAL: number}}
             */
            $scope.modes = {
                HYPOTHESIS: 0,
                INTERNAL: 1
            };

            /**
             * Available learn algorithms
             * @type {Object}
             */
            $scope.learnAlgorithms = learnAlgorithms;

            /**
             * The layout settings for the displayed hypothesis
             * @type {undefined|Object}
             */
            $scope.layoutSettings;

            /**
             * The mode that is used
             * @type {number}
             */
            $scope.mode = $scope.modes.HYPOTHESIS;

            /**
             * The index of the step from the results that should be shown
             * @type {number}
             */
            $scope.pointer = $scope.results.length - 1;

            /**
             * Checks if the property 'algorithmInformation' is define which holds the internal data structure
             * for the algorithm of a learn result
             * @returns {boolean|*}
             */
            $scope.hasInternalDataStructure = function () {
                return angular.isDefined($scope.results[$scope.pointer].algorithmInformation);
            };

            /**
             * Switches the mode to the one to display the internal data structure
             */
            $scope.showInternalDataStructure = function () {
                $scope.mode = $scope.modes.INTERNAL;
            };

            /**
             * Switches the mode to the one to display the hypothesis
             */
            $scope.showHypothesis = function () {
                $scope.mode = $scope.modes.HYPOTHESIS;
            }
        }
    }

    /**
     * The directive to display a closeable learn result panel for the panel manager. Requires to be a child of a
     * panelManager directive. For everything else see {@link learnResultsPanel}
     *
     * @returns {{require: string, scope: {results: string, index: string}, templateUrl: string, link: link}}
     */
    function learnResultsSlideshowPanel(paths) {

        // the directive
        return {
            require: '^panelManager',
            scope: {
                results: '=',
                index: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/learn-results-slideshow-panel.html',
            link: link
        };

        // the directives behaviour
        function link(scope, el, attrs, ctrl) {

            /**
             * Tells the panel manager to close this panel
             */
            scope.close = function () {
                ctrl.closePanelAt(scope.index);
            }
        }
    }
}());