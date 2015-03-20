(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('learnResultsPanel', learnResultsPanel)
        .directive('learnResultsSlideshowPanel', learnResultsSlideshowPanel);

    learnResultsPanel.$inject = ['paths', 'learnAlgorithms'];
    learnResultsSlideshowPanel.$inject = ['paths'];

    /**
     * The directive that displays a browsable list of learn results. For each result, it can display the observation
     * table, if L* was used, or the Discrimination Tree from the corresponding algorithm.
     *
     * Use it like '<learn-results-panel results="..."> ... </learn-results-panel>'
     *
     * @param paths
     * @param learnAlgorithms
     * @returns {{scope: {results: string}, transclude: boolean, templateUrl: string, controller: *[]}}
     */
    function learnResultsPanel(paths, learnAlgorithms) {
        return {
            scope: {
                results: '='
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
     *
     * @returns {{require: string, scope: {results: string, index: string}, templateUrl: string, link: link}}
     */
    function learnResultsSlideshowPanel() {

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