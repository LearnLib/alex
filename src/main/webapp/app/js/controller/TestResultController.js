(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestResultController', [
            '$scope', 'SessionService', 'TestResource', 'SelectionService',
            TestResultController
        ]);

    function TestResultController($scope, SessionService, TestResource, SelectionService) {

        $scope.project = SessionService.project.get();
        $scope.tests = [];

        //////////

        TestResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
            });

        //////////

        $scope.deleteTest = function (test) {

            SelectionService.removeSelection(test);

            TestResource.delete($scope.project.id, test.testNo)
                .then(function () {
                    _.remove($scope.tests, {testNo: test.testNo});
                })
        };

        $scope.deleteTests = function () {

            var selectedTests = SelectionService.getSelected($scope.tests);
            var testNos;
            
            if (selectedTests.length > 0) {
            	testNos = _.pluck(selectedTests, 'testNo');
            	TestResource.delete($scope.project.id, testNos)
            		.then(function(){
            			_.forEach(testNos, function(testNo){
            				_.remove($scope.tests, {testNo: testNo})
            			})
            		})
            }
        }
    }
}());
