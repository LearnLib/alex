(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsController', [
            '$scope', 'SessionService', 'LearnResultResource', 'SelectionService', 'PromptService',
            LearnResultsController
        ]);

    function LearnResultsController($scope, SessionService, LearnResultResource, SelectionService, PromptService) {

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

            PromptService.confirm("Do you want to permanently delete this result?")
	            .then(function(){
	            	LearnResultResource.delete($scope.project.id, test.testNo)
	                .then(function () {
	                    _.remove($scope.tests, {testNo: test.testNo});
	                })
	            })
        };

        $scope.deleteTests = function () {

            var selectedTests = SelectionService.getSelected($scope.tests);
            var testNos;
            
            if (selectedTests.length > 0) {
            	testNos = _.pluck(selectedTests, 'testNo');
            	
            	PromptService.confirm("Do you want to permanently delete this result?")
	            	.then(function(){
	            		LearnResultResource.delete($scope.project.id, testNos)
	            		.then(function(){
	            			_.forEach(testNos, function(testNo){
	            				_.remove($scope.tests, {testNo: testNo})
	            			})
	            		})
	            	})
            }
        }
    }
}());
