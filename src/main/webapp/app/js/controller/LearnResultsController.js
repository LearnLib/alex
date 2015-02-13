(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsController', [
            '$scope', 'SessionService', 'LearnResultResource', 'SelectionService',
            LearnResultsController
        ]);

    function LearnResultsController($scope, SessionService, LearnResultResource, SelectionService) {

        $scope.project = SessionService.project.get();
        $scope.tests = [];

        //////////

        LearnResultResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
            });

        //////////

        $scope.deleteTest = function (test) {

            SelectionService.removeSelection(test);

            LearnResultResource.delete($scope.project.id, test.testNo)
                .then(function () {
                    _.remove($scope.tests, {testNo: test.testNo});
                })
        };

        $scope.deleteTests = function () {

            var selectedTests = SelectionService.getSelected($scope.tests);
            var testNos;
            
            if (selectedTests.length > 0) {
            	testNos = _.pluck(selectedTests, 'testNo');
            	LearnResultResource.delete($scope.project.id, testNos)
            		.then(function(){
            			_.forEach(testNos, function(testNo){
            				_.remove($scope.tests, {testNo: testNo})
            			})
            		})
            }
        }
    }
}());
