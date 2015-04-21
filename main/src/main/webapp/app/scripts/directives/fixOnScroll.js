(function(){
	'use strict';
	
	angular
		.module('ALEX.directives')
        .directive('fixOnScroll', fixOnScroll);

    fixOnScroll.$inject = ['$window'];

    /**
     * The directive that should be used for fixing elements as soon as a certain scroll point in the browser is
     * reached. Can only be used as an attribute. It automatically creates a placeholder element with the same height
     * of the fixed one for smooth scrolling. Best is you use it only on divs...
     *
     * Attribute fixOnScroll should contain a JSON string with properties 'top' and 'class' where top is the amount of
     * pixels that should be scrolled down before applying 'class'.
     *
     * !! Does not automatically fix the element, the toggles css class should do that !!
     *
     * Use: '<div fix-on-scroll="{top:120, class:'aCSSClass'}"></div>'
     *
     * @param $window - The angular window wrapper
     * @returns {{link: link}}
     */
	function fixOnScroll($window) {
        return {
            restrict: 'A',
			link: link
		};

        function link (scope, el, attrs) {
		
			// get settings from attribute (top & class)
			var settings = scope.$eval(attrs.fixOnScroll);
			if (angular.isUndefined(settings.top) || angular.isUndefined(settings.class)) {
				 return;
			}

			// get element height for the placeholder element
			var height = el[0].offsetHeight;

			// create, configure, hide & append the placeholder element after the element
			var placeholder = document.createElement('div');
			placeholder.style.height = height + 'px';
			placeholder.style.display = 'none';
			el.after(placeholder);

			// listen to window scroll event and add or remove the specified class to or from the element
			// and show or hide the placeholder for a smooth scrolling behaviour
			angular.element($window).on('scroll', function () {
				 if ($window.scrollY >= settings.top) {
					  if (!el.hasClass(settings.class)) {
							placeholder.style.display = 'block';
							el.addClass(settings.class);
					  }
				 } else {
					  if (el.hasClass(settings.class)) {
							placeholder.style.display = 'none';
							el.removeClass(settings.class);
					  }
				 }
			})
		}
	}
}());
