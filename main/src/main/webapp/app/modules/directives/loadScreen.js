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
                <div id="load-screen" ng-if="show">
                    <p class="text-center" id="load-screen-indicator">
                        <i class="fa fa-spin fa-3x fa-circle-o-notch"></i>
                    </p>
                </div>
            `,
        link: link
    };

    function link(scope) {

        /**
         * If the loadscreen is visible or not
         * @type {boolean}
         */
        scope.show = false;

        // watch the change of pendingRequests and change the visibility of the load screen
        scope.$watch(() => $http.pendingRequests.length > 0, value => {
            scope.show = value ? true : false;
        });
    }
}

export default loadScreen;