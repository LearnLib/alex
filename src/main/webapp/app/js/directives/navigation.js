(function(){
	'use strict';
	
	angular
		.module('weblearner.directives')
		.directive('navigation', navigation);
	
	function navigation() {
		
		var directive = {
			templateUrl: 'app/partials/directives/navigation.html',
			link: link,
			controller: ['$scope', '$state', 'SessionService', controller]
		};
		return directive;
		
		//////////
		
		function link(scope, el, attrs) {

            var menuButton = angular.element(el[0].getElementsByClassName('navbar-menu'));
            var wrapper = angular.element(el[0].getElementsByClassName('app-navigation-wrapper'));
            var view = angular.element(document.getElementById('view'));
            var cssClass = 'has-off-screen-navigation';

            menuButton.on('click', toggleNavigation);

            function toggleNavigation(e) {
                e.stopPropagation();

                if (wrapper.hasClass(cssClass)) {
                    wrapper.removeClass(cssClass);
                } else {
                    wrapper.addClass(cssClass);
                    wrapper.on('click', hideNavigation);
                }
            }

            function hideNavigation(e) {
                if (e.target.tagName == 'A' && e.target.getAttribute('href') != '#') {
                    wrapper.removeClass(cssClass);
                    wrapper.off('click', hideNavigation);
                }
            }
        }
		
		//////////
		
		function controller($scope, $state, SessionService){
			
			/** the project */
	        $scope.project = SessionService.project.get();

	        //////////

	        // load project into scope when projectOpened is emitted
	        $scope.$on('project.opened', function () {
	            $scope.project = SessionService.project.get();
	        });

	        // delete project from scope when projectOpened is emitted
	        $scope.$on('project.closed', function () {
	            $scope.project = null;
	        });

	        //////////

	        /**
	         * remove the project object from the session and redirect to the start page
	         */
	        $scope.closeProject = function () {
	        	SessionService.project.remove();
	            $state.go('home');
	        }
		}
	}
}());