(function(){
	'use strict';
	
	angular
		.module('weblearner.directives')
		.directive('counterExampleBuilder', counterExampleBuilder);
	
	counterExampleBuilder.$inject = ['paths'];
	
	function counterExampleBuilder(paths){
		
		var directive = {
			scope: {},
			controller: ['$scope', controller],
			templateUrl: paths.views.DIRECTIVES + '/counter-example-builder.html'
		}
		return directive;
				
		function controller($scope){
			
			$scope.inputs = ['w1', 'w2', 'w3'];

	        $scope.counterExample = [
	            {input: 'w1', output: 'output1'},
	            {input: 'w2', output: 'output2'},
	            {input: 'w3', output: 'output3'},
	        ]

	        $scope.add = function() {
	            $scope.counterExample.push({input: null, output: null})
	        }

	        $scope.remove = function(index) {
	            $scope.counterExample.splice(index, 1);
	        }

	        $scope.onDropInput = function(data, evt, index){
	            $scope.counterExample[index].input = data['json/custom-object'];
	        }

	        $scope.onDropOutput = function(data, evt, index){
	            $scope.counterExample[index].output = data['json/custom-object'];
	        }
		}
	};
}())