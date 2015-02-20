(function(){
	'use strict';
		
	angular
		.module('weblearner.directives')
		.directive('openHypothesisLayoutSettingsModal', [
             '$modal', openHypothesisLayoutSettingsModal
         ]);

	function openHypothesisLayoutSettingsModal($modal) {
		
		var directive = {
            scope: {
                layoutSettings: '=',
            },
            link: link
		};
		return directive;
		
		//////////
		
		function link(scope, el, attrs) {
			
			el.on('click', handleModal);
			
			//////////

            function handleModal() {
            	                
            	var modal = $modal.open({
                    templateUrl: 'app/partials/modals/hypothesis-layout-settings-modal.html',
                    controller: 'HypothesisLayoutSettingsController',
                    resolve: {
                        modalData: function () {
                            return {
                                layoutSettings: scope.layoutSettings
                            }
                        }
                    }
                });
                
                modal.result.then(function (layoutSettings) {
                    scope.layoutSettings = layoutSettings
                })
            }
		}
	}
}());