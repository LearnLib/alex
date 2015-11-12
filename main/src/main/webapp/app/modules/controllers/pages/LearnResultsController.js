/**
 * The controller for listing all final test results.
 *
 * @param $scope - The controllers scope
 * @param $state - The ui.router $state service
 * @param SessionService - The SessionService
 * @param LearnResultResource - The API resource for learn results
 * @param PromptService - The service for prompts
 * @param ToastService - The ToastService
 * @param _ - Lodash
 * @constructor
 */
// @ngInject
function LearnResultsController($scope, $state, SessionService, LearnResultResource, PromptService, ToastService, _) {

    // The project that is saved in the session
    const project = SessionService.project.get();

    /**
     * All final test results of a project
     * @type {LearnResult[]}
     */
    $scope.results = [];

    /**
     * The test results the user selected
     * @type {LearnResult[]}
     */
    $scope.selectedResults = [];

    // get all final test results
    LearnResultResource.getAllFinal(project.id)
        .then(results => {
            $scope.results = results;
        });

    /**
     * Deletes a test result from the server after prompting the user for confirmation
     *
     * @param {LearnResult} result - The test result that should be deleted
     */
    $scope.deleteResult = function (result) {
        PromptService.confirm("Do you want to permanently delete this result? Changes cannot be undone.")
            .then(function () {
                LearnResultResource.delete(result)
                    .then(function () {
                        ToastService.success('Learn result for test <strong>' + result.testNo + '</strong> deleted');
                        _.remove($scope.results, {testNo: result.testNo});
                    })
                    .catch(function (response) {
                        ToastService.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                    });
            })
    };

    /**
     * Deletes selected test results from the server after prompting the user for confirmation
     */
    $scope.deleteResults = function () {
        if ($scope.selectedResults.length > 0) {
            PromptService.confirm("Do you want to permanently delete theses results? Changes cannot be undone.")
                .then(function () {
                    LearnResultResource.delete($scope.selectedResults)
                        .then(function () {
                            ToastService.success('Learn results deleted');
                            _.forEach($scope.selectedResults, function (result) {
                                _.remove($scope.results, {testNo: result.testNo})
                            })
                        })
                        .catch(function (response) {
                            ToastService.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                        });
                })
        }
    };

    /**
     * Opens the learning result compare view with the selected results opened
     */
    $scope.openSelectedResults = function () {
        if ($scope.selectedResults.length > 0) {
            var testNos = _.pluck($scope.selectedResults, 'testNo');
            $state.go('learn.results.compare', {testNos: testNos.join(',')})
        }
    }
}

export default LearnResultsController;
