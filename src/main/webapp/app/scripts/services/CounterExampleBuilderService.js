(function(){
	
	angular
		.module('weblearner.services')
		.service('CounterExampleBuilderService', CounterExampleBuilderService);
	
	CounterExampleBuilderService.$inject = ['$rootScope'];
	
	function CounterExampleBuilderService($rootScope) {
		
		var service = {
			open: open,
			close: close,
			ok: ok
		}
		return service;
		
		function open(){
			$rootScope.$broadcast('counterExampleBuilder.open');
		}
		
		function close(){
			$rootScope.$broadcast('counterExampleBuilder.close');
		}
		
		function ok(){
			$rootScope.$broadcast('counterExampleBuilder.ok');
		}
	}
}())