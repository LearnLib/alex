(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('loadScreen', loadScreen);

    /**
     * The load screen that is shown during http requests. It lays over the application to prevent further
     * interactions with the page. The navigation is still usable. Add it right after the body and give the element
     * a high value for z-index in the stylesheet.
     *
     * Use is like '<load-screen></load-screen>'.
     *
     * @param $http - The angular $http service
     * @returns {{scope: {}, template: string, link: link}}
     */
    // @ngInject
    function loadScreen($http) {
        return {
            scope: {},
            template: `
                <div id="load-screen">
                    <p class="text-center" id="load-screen-indicator">
                        <i class="fa fa-spin fa-3x fa-circle-o-notch"></i>
                    </p>
                </div>
            `,
            link: link
        };

        function link(scope, el) {

            /**
             * Shows if there are currently any active http requests going on
             *
             * @returns {boolean} - If there are any active requests
             */
            scope.hasPendingRequests = function () {
                return $http.pendingRequests.length > 0;
            };

            // watch the change of pendingRequests and change the visibility of the loadscreen
            scope.$watch(scope.hasPendingRequests, function (value) {
                if (value) {
                    el[0].style.display = 'block';
                } else {
                    el[0].style.display = 'none';
                }
            });
        }
    }
}());