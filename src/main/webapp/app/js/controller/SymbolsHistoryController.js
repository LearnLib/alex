(function(){
	'use strict';
	
	console.log('asd');
	
	angular
		.module('weblearner.controller')
		.controller('SymbolsHistoryController', [
		     '$scope', '$stateParams', 'SymbolResource', 'SessionService',
		     SymbolsHistoryController
	     ]);
     
    function SymbolsHistoryController($scope, $stateParams, SymbolResource, SessionService) {
		
		$scope.project = SessionService.project.get();
		$scope.revisions = [];
		$scope.latestSymbol;
		
		//////////
		
		SymbolResource.getRevisions($scope.project.id, $stateParams.symbolId)
			.then(function(revisions){
				$scope.latestSymbol = revisions.pop();
				$scope.revisions = revisions;
			})
		
		//////////
		
		$scope.restoreRevision = function(revision) {
			
			// copy all important properties from the revision to the latest
			$scope.latestSymbol.name = revision.name;
			$scope.latestSymbol.abbreviation = revision.abbreviation;
			$scope.latestSymbol.actions = revision.actions;
			
			// update symbol with new properties
			SymbolResource.update($scope.project.id, $scope.latestSymbol)
				.then(function(symbol){
					
					$scope.revisions.push($scope.latestSymbol)
					$scope.latestSymbol = symbol;
				})
		}
	}
}());