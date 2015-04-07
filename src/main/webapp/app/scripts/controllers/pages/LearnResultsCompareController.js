(function () {
    'use strict';

    angular
        .module('ALEX.controller')
        .controller('LearnResultsCompareController', LearnResultsCompareController);

    LearnResultsCompareController.$inject = ['$scope', '$stateParams', 'SessionService', 'LearnResult', '_'];

    /**
     * The controller that handles the page for displaying multiple complete learn results in a slide show.
     *
     * The template can be found at 'views/pages/learn-result-compare.html'
     *
     * @param $scope - The controllers $scope
     * @param $stateParams - The state parameters
     * @param Session - The session service
     * @param LearnResult - The LearnResult model
     * @param _ - Lodash
     * @constructor
     */
    function LearnResultsCompareController($scope, $stateParams, Session, LearnResult, _) {

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
            LearnResult.Resource.getAllFinal(project.id)
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
            var numbers = testNos.split(',');
            _.forEach(numbers, function (testNo) {
                LearnResult.Resource.getComplete(project.id, testNo)
                    .then(function (completeTestResult) {
                        if (angular.isUndefined(index)) {
                            $scope.panels.push(completeTestResult);
                        } else {
                            $scope.panels[index] = completeTestResult;
                        }
                    })
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
        }
    }

}());