(function(){
	'use strict';
		
	angular
		.module('weblearner.controller')
		.controller('SymbolsTrashController', [
          '$scope', 'type', 'SessionService', 'SymbolResource',
          SymbolsTrashController
          ]);
          
    function SymbolsTrashController($scope, type, SessionService, SymbolResource){
		
		$scope.project = SessionService.project.get();
		$scope.symbols = [];
		
		//////////
		
		SymbolResource.getAllDeleted($scope.project.id, type)
			.then(function(symbols){
				$scope.symbols = symbols;
				console.log($scope.symbols);
			})
			
		//////////
			
		$scope.recover = function(symbol){
			SymbolResource.recover($scope.project.id, symbol.id)
				.then(function(symbol){
					_.remove($scope.symbols, {id: symbol.id});
				})
		}
	}
}())