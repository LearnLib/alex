(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsController', LearnResultsController);

    LearnResultsController.$inject = ['$scope', 'SessionService', 'LearnResult', 'PromptService', 'ToastService'];

    /**
     * The controller for listing all final test results.
     *
     * The template can be found at 'views/pages/learn-results.html'
     *
     * @param $scope - The controllers scope
     * @param Session - The SessionService
     * @param LearnResult - The service for creating LearnResults
     * @param PromptService - The service for prompts
     * @param Toast - The ToastService
     * @constructor
     */
    function LearnResultsController($scope, Session, LearnResult, PromptService, Toast) {

        // The project that is saved in the session
        var project = Session.project.get();

        /**
         * All final test results of a project
         * @type {Array}
         */
        $scope.results = [];

        /**
         * The test results the user selected
         * @type {Array}
         */
        $scope.selectedResults = [];

        (function init() {

            // get all final test results
            LearnResult.Resource.getAllFinal(project.id)
                .then(function (results) {
                    $scope.results = results;
                });
        }());

        /**
         * Deletes a test result from the server after prompting the user for confirmation
         *
         * @param result - The test result that should be deleted
         */
        $scope.deleteResult = function (result) {
            PromptService.confirm("Do you want to permanently delete this result? Changes cannot be undone.")
                .then(function () {
                    LearnResult.Resource.delete(project.id, result.testNo)
                        .then(function () {
                            Toast.success('Learn result for test <strong>' + result.testNo + '</strong> deleted');
                            _.remove($scope.results, {testNo: result.testNo});
                        })
                        .catch(function (response) {
                            Toast.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                        });
                })
        };

        /**
         * Deletes selected test results from the server after prompting the user for confirmation
         */
        $scope.deleteResults = function () {
            var testNos;

            if ($scope.selectedResults.length > 0) {
                testNos = _.pluck($scope.selectedResults, 'testNo');
                PromptService.confirm("Do you want to permanently delete theses results? Changes cannot be undone.")
                    .then(function () {
                        LearnResult.Resource.deleteSome(project.id, testNos)
                            .then(function () {
                                Toast.success('Learn results deleted');
                                _.forEach(testNos, function (testNo) {
                                    _.remove($scope.results, {testNo: testNo})
                                })
                            })
                            .catch(function (response) {
                                Toast.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                            });
                    })
            }
        }
    }
}());
