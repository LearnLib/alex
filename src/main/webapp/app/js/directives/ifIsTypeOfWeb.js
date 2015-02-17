(function() {
	'use strict';

	angular.module('weblearner.directives').directive('ifIsTypeOfWeb',
			[ 'ngIfDirective', ifIsTypeOfWeb ]);

	function ifIsTypeOfWeb(ngIfDirective) {
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
			var value = scope.$eval(attrs['ifIsTypeOfWeb']);

			attrs.ngIf = function() {
				return value == 'web';
			};
			ngIf.link.apply(ngIf, arguments);
		}
	}
}());