(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('LearnResultsCompareController', LearnResultsCompareController);

    LearnResultsCompareController.$inject = [
        '$scope', '$timeout', '$stateParams', 'SessionService', 'LearnResultResource', '_', 'ErrorService'
    ];

    /**
     * The controller that handles the page for displaying multiple complete learn results in a slide show.
     *
     * Template: 'views/learn-result-compare.html'
     *
     * @param $scope - The controllers $scope
     * @param $timeout - angular $timeout service
     * @param $stateParams - The state parameters
     * @param Session - The session service
     * @param LearnResultResource - The API resource for learn results
     * @param _ - Lodash
     * @param Error - The ErrorService
     * @constructor
     */
    function LearnResultsCompareController($scope, $timeout, $stateParams, Session, LearnResultResource, _, Error) {

        // the project that is saved in the session
        var project = Session.project.get();

        /**
         * All final learn results from all tests that were made for a project
         * @type {LearnResult[]}
         */
        $scope.results = [];

        /**
         * The list of active panels where each panel contains a complete learn result set
         * @type {LearnResult[][]}
         */
        $scope.panels = [];

        /**
         * The list of layout settings for the current hypothesis that is shown in a panel
         * @type {Object[]}
         */
        $scope.layoutSettings = [];

        // load all final learn results of all test an then load the complete test results from the test numbers
        // that are passed from the url in the panels
        (function init() {
            if (angular.isUndefined($stateParams.testNos)) {
                Error.setErrorMessage("There are no test numbers defined in the URL");
                Error.goToErrorPage();
            }
            LearnResultResource.getAllFinal(project.id)
                .then(function (results) {
                    $scope.results = results;
                    return $stateParams.testNos;
                })
                .then(loadComplete);
        }());

        /**
         * Loads a complete learn result set from a test number in the panel with a given index
         *
         * @param {String} testNos - The test numbers as concatenated string, separated by a ','
         * @param {number} index - The index of the panel the complete learn result should be displayed in
         */
        function loadComplete(testNos, index) {
            LearnResultResource.getComplete(project.id, testNos.split(','))
                .then(function (completeResults) {
                    _.forEach(completeResults, function (result) {
                        if (angular.isUndefined(index)) {
                            $scope.panels.push(result);
                        } else {
                            $scope.panels[index] = result;
                        }
                    });
                })
                .catch(function (response) {
                    Error.setErrorMessage(response.data.message);
                    Error.goToErrorPage();
                })
        }

        /**
         * Loads a complete learn result set from a learn result in the panel with a given index
         *
         * @param {LearnResult} result - The learn result whose complete set should be loaded in a panel
         * @param {number} index - The index of the panel the complete set should be displayed in
         */
        $scope.fillPanel = function (result, index) {
            loadComplete(result.testNo + '', index);
        };

        /**
         * Adds a new empty panel
         */
        $scope.addPanel = function () {
            $scope.panels.push(null)
        };

        /**
         * Removes a panel by a given index
         * @param {number} index - The index of the panel to remove
         */
        $scope.closePanel = function (index) {
            $scope.panels[index] = null;
            $timeout(function () {
                $scope.panels.splice(index, 1);
            }, 0);
            $timeout(function () {
                window.dispatchEvent(new Event('resize'));
            }, 100)
        }
    }

}());