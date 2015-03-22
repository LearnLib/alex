(function() {
	'use strict';

	angular
		.module('weblearner.directives')
        .directive('downloadAsJson', downloadAsJson);

    downloadAsJson.$inject = ['FileDownloadService'];

    /**
     * The directive that can be applied to any element as an attribute that downloads an object or an array as
     * a *.json file. Attaches a click event to the element that downloads the file. Can only be used as attribute.
     *
     * Attribute 'data' has to be defined in order to work and has to be type of object, array or a function
     * that returns an object or an array.
     *
     * Use it like '<button download-as-json data="...">Click Me!</button>'
     *
     * @param FileDownloadService
     * @returns {{restrict: string, scope: {data: string}, link: link}}
     */
    function downloadAsJson(FileDownloadService) {

        // the directive
        return {
			restrict: 'A',
			scope:  {
				data: '='
			},
			link: link
        };

        // the directives behaviour
		function link(scope, el, attrs) {
            el.on('click', function () {
                if (angular.isDefined(scope.data)) {
                    var json;

                    // if data parameter was function call it otherwise just convert data into json
                    if (angular.isObject(scope.data) || angular.isArray(scope.data)) {
                        json += encodeURIComponent(angular.toJson(scope.data));
                    } else if (angular.isFunction(scope.data)) {
                        json += encodeURIComponent(angular.toJson(scope.data()));
                    }

                    // download json
                    if (angular.isDefined(json)) {
                        FileDownloadService.downloadJson(json);
                    }
                }
            });
		}
	}
}());