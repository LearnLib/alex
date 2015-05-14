(function(){
	'use strict';
	
	angular
		.module('ALEX.modals')
		.controller('HypothesisLayoutSettingsController', [
	         '$scope', '$modalInstance', 'modalData',
	         HypothesisLayoutSettingsController
       ]);
	
	function HypothesisLayoutSettingsController($scope, $modalInstance, modalData){
		
		var _defaultLayoutSetting = {
			nodesep: 50,
			edgesep: 25,
			ranksep: 50,
			multigraph: false
		};
		
		$scope.layoutSettings = {};
		
		//////////
		
		if (angular.isDefined(modalData.layoutSettings)) {
			$scope.layoutSettings = angular.copy(modalData.layoutSettings);
		} else {
			$scope.layoutSettings = angular.copy(_defaultLayoutSetting);
		}
		
		//////////
		
		$scope.update = function(){					
			$modalInstance.close($scope.layoutSettings);
		};
		
		$scope.close = function(){			
			$modalInstance.dismiss();
		};
		
		$scope.defaultLayoutSettings = function(){	
			$scope.layoutSettings = angular.copy(_defaultLayoutSetting);
		};
	}
}());