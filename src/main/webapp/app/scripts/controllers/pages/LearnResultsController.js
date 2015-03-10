(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsController', LearnResultsController);

    LearnResultsController.$inject = [
        '$scope', 'SessionService', 'LearnResultResource', 'SelectionService', 'PromptService', 'ToastService'
    ];

    /**
     * The controller for listing all final test results.
     *
     * The template can be found at 'views/pages/learn-results.html'
     *
     * @param $scope
     * @param Session
     * @param LearnResultResource
     * @param SelectionService
     * @param PromptService
     * @constructor
     */
    function LearnResultsController($scope, Session, LearnResultResource, SelectionService, PromptService, Toast) {

        // The project that is saved in the session
        var project = Session.project.get();

        /**
         * All final test results of a project
         *
         * @type {Array}
         */
        $scope.results = [];

        // get all final test results
        LearnResultResource.getAllFinal($scope.project.id)
            .then(function (results) {
                $scope.results = results;
            });

        /**
         * Deletes a test result from the server after prompting the user for confirmation
         *
         * @param result - The test result that should be deleted
         */
        $scope.deleteResult = function (result) {
            PromptService.confirm("Do you want to permanently delete this result?")
                .then(function () {
                    LearnResultResource.delete(project.id, result.testNo)
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
            var selectedResults = SelectionService.getSelected($scope.results);
            var testNos;

            if (selectedResults.length > 0) {
                testNos = _.pluck(selectedResults, 'testNo');
                PromptService.confirm("Do you want to permanently delete theses results?")
                    .then(function () {
                        LearnResultResource.delete(project.id, testNos)
                            .then(function () {
                                Toast.success('Learn result for test deleted');
                                _.forEach(testNos, function (testNo) {
                                    _.remove($scope.tests, {testNo: testNo})
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
