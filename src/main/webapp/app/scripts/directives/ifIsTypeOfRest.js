(function() {
	'use strict';

	angular.module('weblearner.directives').directive('ifIsTypeOfRest',
			[ 'ngIfDirective', ifIsTypeOfRest ]);

	function ifIsTypeOfRest(ngIfDirective) {
		var ngIf = ngIfDirective[0];

		var directive = {
			transclude : ngIf.transclude,
			priority : ngIf.priority,
			terminal : ngIf.terminal,
			restrict : ngIf.restrict,
			link : link
		};
		return directive;

		// ////////

		function link(scope, el, attrs) {
			var value = scope.$eval(attrs['ifIsTypeOfRest']);

			attrs.ngIf = function() {
				return value == 'rest';
			};
			ngIf.link.apply(ngIf, arguments);
		}
	}
}());