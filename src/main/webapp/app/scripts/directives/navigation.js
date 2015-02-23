(function(){
	'use strict';
	
	angular
		.module('weblearner.directives')
		.directive('navigation', [
            'paths',
            navigation
        ]);
	
	function navigation(paths) {
		
		var directive = {
			templateUrl: paths.views.DIRECTIVES + '/navigation.html',
			link: link,
			controller: ['$scope', '$window', '$state', 'SessionService', controller]
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
		
		function controller($scope, $window, $state, SessionService){

			var mediaQuery;

			//////////
			
			/** the project */
	        $scope.project = SessionService.project.get();
			$scope.hover = false;
			$scope.offScreen = false;

	        //////////

			this.setHover = function(hover){
				$scope.hover = hover;
			};

			this.isHover = function(){
				return $scope.hover;
			};

			this.isOffScreen = function(){
				return $scope.offScreen;
			};

			//////////

	        // load project into scope when projectOpened is emitted
	        $scope.$on('project.opened', function () {
	            $scope.project = SessionService.project.get();
	        });

	        // delete project from scope when projectOpened is emitted
	        $scope.$on('project.closed', function () {
	            $scope.project = null;
	        });

			// watch for media query event
			mediaQuery = window.matchMedia('screen and (max-width: 768px)');
			mediaQuery.addListener(mediaQueryMatches);
			mediaQueryMatches(null, mediaQuery.matches);

			//////////

			function mediaQueryMatches(evt, matches){
				if (evt === null) {
					$scope.offScreen = matches ? true : false;
				} else {
					$scope.offScreen = evt.matches;
				}
			}

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

	angular
		.module('weblearner.directives')
		.directive('dropdownNavigation', ['$document', dropdownNavigation]);

	function dropdownNavigation($document){
		return {
			require: ['dropdown', '^navigation'],
			link: function(scope, el, attrs, ctrls) {

				var dropDownCtrl = ctrls[0];
				var navigationCtrl = ctrls[1];

				el.on('click', function(e){
					e.stopPropagation();

					if (!navigationCtrl.isOffScreen()){
						if (!navigationCtrl.isHover()){
							navigationCtrl.setHover(true);
							$document.on('click', closeDropDown);
						}
					}
				}).on('mouseenter', function(){
					if (navigationCtrl.isHover()){
						scope.$apply(function(){
							dropDownCtrl.toggle(true);
						})
					}
				});

				function closeDropDown() {
					navigationCtrl.setHover(false);
					$document.off('click', closeDropDown);
				}
			}
		}
	}
}());