(function(){
	
	angular
		.module('weblearner.directives')
		.directive('openCounterExampleBuilder', openCounterExampleBuilder)
		
	openCounterExampleBuilder.$inject = ['CounterExampleBuilderService'];
	
	function openCounterExampleBuilder(CounterExampleBuilder) {
		
		var directive = {
			scope: {
				inputs: '=',
				outputs: '=',
				counterExample: '='
			},
			link: link
		};
		return directive;
		
		function link(scope, el, attrs) {
			
			el.on('click', function(){
				CounterExampleBuilder.open({
					inputs: angular.copy(scope.inputs),
					outputs: angular.copy(scope.outputs),
					counterExample: angular.copy(scope.counterExample)
				});
			});
		}
	}
}());