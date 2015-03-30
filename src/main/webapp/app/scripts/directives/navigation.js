(function(){
	'use strict';

	angular
		.module('weblearner.directives')
		.directive('navigation', [
            'paths',
            navigation
        ]);

	function navigation(paths) {

        return {
			templateUrl: paths.views.DIRECTIVES + '/navigation.html',
			link: link,
            controller: [
                '$scope', '$window', '$state', 'SessionService',
                controller
            ]
		};
    }

		//////////

		function link(scope, el, attrs) {

            var handle = angular.element(el[0].getElementsByClassName('navbar-menu-handle'));
            var offscreen = angular.element(el[0].getElementsByClassName('navbar-offscreen'));
            var offscreenClass = 'show';

            handle.on('click', toggleNavigation);

            function toggleNavigation(e) {
                e.stopPropagation();
                offscreen.toggleClass(offscreenClass);
            }

            function hideNavigation(e) {
                if (e.target.tagName == 'A' && e.target.getAttribute('href') != '#') {
                    offscreen.removeClass(offscreenClass);
                }
            }
        }

    //
    //	//////////
    //
    function controller($scope, $window, $state, Session) {
        //
        //		var mediaQuery;
        //
        //		//////////
        //
        //		/** the project */
        $scope.project = Session.project.get();
        //		$scope.hover = false;
        //		$scope.offScreen = false;
        //
        //        //////////
        //
        //		this.setHover = function(hover){
        //			$scope.hover = hover;
        //		};
        //
        //		this.isHover = function(){
        //			return $scope.hover;
        //		};
        //
        //		this.isOffScreen = function(){
        //			return $scope.offScreen;
        //		};
        //
        //		//////////
        //
	        // load project into scope when projectOpened is emitted
	        $scope.$on('project.opened', function () {
                $scope.project = Session.project.get();
	        });

	        // delete project from scope when projectOpened is emitted
	        $scope.$on('project.closed', function () {
	            $scope.project = null;
	        });
        //
        //		// watch for media query event
        //		mediaQuery = window.matchMedia('screen and (max-width: 768px)');
        //		mediaQuery.addListener(mediaQueryMatches);
        //		mediaQueryMatches(null, mediaQuery.matches);
        //
        //		//////////
        //
        //		function mediaQueryMatches(evt, matches){
        //			if (evt === null) {
        //				$scope.offScreen = matches ? true : false;
        //			} else {
        //				$scope.offScreen = evt.matches;
        //			}
        //		}
        //
        //        //////////
        //
	        /**
	         * remove the project object from the session and redirect to the start page
	         */
	        $scope.closeProject = function () {
                Session.project.remove();
	            $state.go('home');
	        }
		}

    //}
    //
    //angular
    //	.module('weblearner.directives')
    //	.directive('dropdownNavigation', ['$document', dropdownNavigation]);
    //
    //function dropdownNavigation($document){
    //	return {
    //		require: ['dropdown', '^navigation'],
    //		link: function(scope, el, attrs, ctrls) {
    //
    //			var dropDownCtrl = ctrls[0];
    //			var navigationCtrl = ctrls[1];
    //
    //			el.on('click', function(e){
    //				e.stopPropagation();
    //
    //				if (!navigationCtrl.isOffScreen()){
    //					if (!navigationCtrl.isHover()){
    //						navigationCtrl.setHover(true);
    //						$document.on('click', closeDropDown);
    //					}
    //				}
    //			}).on('mouseenter', function(){
    //				if (navigationCtrl.isHover()){
    //					scope.$apply(function(){
    //						dropDownCtrl.toggle(true);
    //					})
    //				}
    //			});
    //
    //			function closeDropDown() {
    //				navigationCtrl.setHover(false);
    //				$document.off('click', closeDropDown);
    //			}
    //		}
    //	}
    //}
}());