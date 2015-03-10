(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webElementPicker', webElementPicker);

    webElementPicker.$inject = ['$window', 'WebElementPickerService', 'paths'];

    /**
     * The web element picker. It is used to select an element from the dom tree of the site of the projects base
     * url.
     *
     * @param $window - AngularJS window wrapper
     * @param WebElementPickerService - The service to communicate with the picker
     * @param paths - The applications constants
     * @returns {{scope: {}, templateUrl: string, link: link, controller: *[]}}
     */
    function webElementPicker($window, WebElementPickerService, paths) {

        var directive = {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/web-element-picker.html',
            link: link,
            controller: [
                '$scope', 'SessionService', 'paths',
                controller
            ]
        };
        return directive;

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            // the iframe where the projects site gets loaded into
            var iframe = el.find('iframe');

            // when moving with the mouse over an element, this elements gets saved in this variable in order to
            // prevent multiple calls of getCssPath for the same element
            var lastTarget = null;

            /**
             * Get the unique CSS XPath from selected Element
             * http://stackoverflow.com/questions/4588119/get-elements-css-selector-without-element-id
             *
             * @param el  - The element to get the unique css path from
             * @returns {String} - The unique css path ot the element
             * @private
             */
            function getCssPath(el) {

                var names = [];
                while (el.parentNode) {
                    if (el.id) {
                        names.unshift('#' + el.id);
                        break;
                    } else {
                        if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
                        else {
                            for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
                            names.unshift(el.tagName + ":nth-child(" + c + ")");
                        }
                        el = el.parentNode;
                    }
                }
                return names.join(" > ");
            }

            /**
             * Saves the element that is under the cursor so that it can be selected. Adds an outline to the element
             * in order to highlight it.
             *
             * @param e - js event
             * @returns {boolean}
             */
            function handleMouseMove(e) {
                if (lastTarget == e.target) {
                    return false;
                } else {
                    if (lastTarget != null) {
                        lastTarget.style.outline = '0px'
                    }
                    lastTarget = e.target;
                }
                lastTarget.style.outline = '5px solid red';
                scope.selector = getCssPath(lastTarget);
                scope.$apply();
            }

            /**
             * Removes the outline from the selected element, removes all events from the iframe and removes the
             * keypress event. When this function is called the selected element is fixed and won't change by any
             * further interaction with the iframe
             *
             * @param e - js event
             */
            function handleClick(e) {
                if (angular.isDefined(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                lastTarget.style.outline = '0px';
                lastTarget = null;

                angular.element(iframe.contents()[0].body).off('mousemove', handleMouseMove);
                angular.element(iframe.contents()[0].body).off('click', handleClick);
                angular.element(document.body).off('keyup', handleKeyUp);
            }

            /**
             * Calls handleClick() when control key is pressed to have an alternative for selecting a dom node without
             * firing any click events on it.
             *
             * @param e
             */
            function handleKeyUp(e) {
                if (e.keyCode == 17) { // strg
                    handleClick();
                }
            }

            /**
             * Loads an entered url into the iframe
             */
            scope.loadUrl = function () {
                if (scope.url == '') {
                    iframe[0].setAttribute('src', scope.proxyUrl);
                } else {
                    iframe[0].setAttribute('src', scope.proxyUrl + '/' + scope.url);
                }
            };

            /**
             * Enables the selection mode and therefore adds events to the iframe
             */
            scope.enableSelection = function () {
                var iframeBody = angular.element(iframe.contents()[0].body);
                iframeBody.on('mousemove', handleMouseMove);
                iframeBody.one('click', handleClick);
                angular.element(document.body).on('keyup', handleKeyUp);
            };
        }

        /**
         * The controller of the web element picker. Listens on events and
         *
         * @param $scope
         * @param SessionService
         * @param paths
         */
        function controller($scope, Session, paths) {

            /**
             * Indicator if web element picker is visible or not
             * @type {boolean}
             */
            $scope.show = false;

            /**
             * The project that is stored in the session. Is used to get the baseUrl of it
             * @type {Project}
             */
            $scope.project = null;

            /**
             * The URL of the proxy
             * policies
             * @type {String|null}
             */
            $scope.proxyUrl = null;

            /**
             * The XPath of the selected element
             * @type {null}
             */
            $scope.selector = null;

            /**
             * The url that is loaded in the iframe
             * @type {string}
             */
            $scope.url = '';

            /**
             * Creates the proxy url where all requests are send to in order to avoid violation of foreign domain
             * @returns {*}
             */
            function buildProxyUrl() {
                return $window.location.origin + paths.api.PROXY_URL + $scope.project.baseUrl;
            }

            /**
             * Initialize scope properties and listen for events
             */
            function init() {
                $scope.project = Session.project.get();
                if ($scope.project != null) {
                    $scope.proxyUrl = buildProxyUrl();
                }

                // show the web element picker when open event gets fired
                $scope.$on('webElementPicker.open', function () {
                    $scope.show = true;
                });

                // when a new project gets opened initialize the controller again
                $scope.$on('project.opened', init);
            }

            /**
             * Makes the web element picker invisible and fires the close event
             */
            $scope.close = function () {
                $scope.show = false;
                WebElementPickerService.close();
            };

            /**
             * Makes the web element Picker invisible and fires the ok event with the selector of the element that was
             * selected. If no selector is defined, then it just closes the picker
             */
            $scope.ok = function () {
                $scope.show = false;
                if ($scope.selector === null) {
                    $scope.close();
                } else {
                    WebElementPickerService.ok($scope.selector);
                }
            };

            init();
        }
    }
}());