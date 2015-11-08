(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('htmlElementPicker', htmlElementPicker)
        .directive('htmlElementPickerWindow', htmlElementPickerWindow)
        .factory('htmlElementPickerInstance', htmlElementPickerInstance);

    /**
     * The directive that creates a new HTML element picker. Can only be used as an attribute and attaches a click
     * event to the source element that opens the picker. On first start, it loads the page that is defined in the
     * projects baseUrl. On following calls the last visited page is loaded.
     *
     * Attribute 'model' is the model for the XPath
     * Attribute 'text' is the model for the .textContent value of the selected element
     *
     * Use: '<button html-element-picker model="..." text="...">Click Me!</button>'
     *
     * @param $document - angular document wrapper
     * @param $compile - angular $compile service
     * @param htmlElementPickerInstance - Holds the promise and methods for opening and closing the picker
     * @returns {{restrict: string, scope: {selectorModel: string}, link: Function}}
     */
    // @ngInject
    function htmlElementPicker($document, $compile, htmlElementPickerInstance) {
        return {
            restrict: 'A',
            scope: {
                selectorModel: '=model',
                textModel: '=text'
            },
            link: link
        };
        function link(scope, el, attrs) {

            // The HTML picker element that is dynamically appended and removed to/from the pages DOM tree
            var picker;

            el.on('click', function () {

                // create a new element picker under the current scope and append to the body
                picker = $compile('<html-element-picker-window></html-element-picker-window>')(scope);
                $document.find('body').prepend(picker);

                // open the picker
                htmlElementPickerInstance.open()
                    .then(function (data) {

                        // copy the selected XPath and .textContent value to the scopes models
                        if (angular.isDefined(scope.selectorModel)) {
                            scope.selectorModel = data.xPath;
                        }
                        if (angular.isDefined(scope.textModel)) {
                            scope.textModel = data.textContent;
                        }
                    })

                    // remove the picker from the dom on close
                    .finally(function () {
                        picker.remove();
                    })
            })
        }
    }

    /**
     * The instance for the HTML element picker that holds the promise offers methods to persist the last opened url as
     * well as opening and closing the HTML element picker
     *
     * @returns {{close: Function, open: Function, setUrl: Function, getUrl: Function}}
     */
    // @ngInject
    function htmlElementPickerInstance($q) {

        // the promise
        var deferred;

        // the url was called at the last opening
        var lastUrl = null;

        return {
            close: close,
            open: open,
            setUrl: setUrl,
            getUrl: getUrl
        };

        /**
         * Resolves the promise with selected data or cancels the promise of no data is defined
         *
         * @param {Object} data - The object that should contain an XPath and a .textContent value
         */
        function close(data) {
            if (angular.isDefined(data)) {
                deferred.resolve(data)
            } else {
                deferred.reject();
            }
        }

        /**
         * Creates the promise that is used to pass data between the directive and the picker
         *
         * @returns {d.promise|promise|qFactory.Deferred.promise|p.ready.promise|fd.g.promise}
         */
        function open() {
            deferred = $q.defer();
            return deferred.promise;
        }

        function setUrl(url) {
            lastUrl = url;
        }

        function getUrl() {
            return lastUrl;
        }
    }

    /**
     * The actual HTML element picker. Handles the complete window including the selection of elements and loading
     * of urls. Works as a 'mini embedded browser'
     *
     * Use: '<html-element-picker-window></html-element-picker-window>'
     *
     * @param $window - angular window wrapper
     * @param SessionService - The SessionService
     * @param paths - The applications paths
     * @param htmlElementPickerInstance - @see{@link htmlElementPickerInstance}
     * @returns {{scope: {}, templateUrl: string, link: link}}
     */
    // @ngInject
    function htmlElementPickerWindow($window, SessionService, paths, htmlElementPickerInstance) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'views/directives/html-element-picker.html',
            link: link
        };

        function link(scope, el) {

            // the iframe where the projects site gets loaded into
            var iframe = el.find('iframe');

            // when moving with the mouse over an element, this elements gets saved in this variable in order to
            // prevent multiple calls of getCssPath for the same element
            var lastTarget = null;

            // the url of the proxy
            var proxyUrl = null;

            /**
             * flag for selection mode
             * @type {boolean}
             */
            scope.isSelectable = false;

            /**
             * The XPath of the selected element
             * @type {null|string}
             */
            scope.selector = null;

            /**
             * The element.textContent value
             * @type {null|string}
             */
            scope.textContent = null;

            /**
             * The url that is loaded in the iframe
             * @type {string}
             */
            scope.url = null;

            /**
             * The project in the session
             * @type {null|Project}
             */
            scope.project = null;

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

                if (lastTarget.nodeName.toLowerCase() === 'input') {
                    scope.textContent = lastTarget.value;
                } else {
                    scope.textContent = lastTarget.textContent;
                }

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

                if (lastTarget !== null) {
                    lastTarget.style.outline = '0px';
                }
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
                    scope.isSelectable = false;
                }
            }

            // load project, create proxy address and load the last url in the iframe
            function init() {
                scope.project = SessionService.project.get();
                proxyUrl = $window.location.origin + paths.api.PROXY_URL;

                scope.url = htmlElementPickerInstance.getUrl();
                scope.loadUrl();
            }

            /**
             * Loads an entered url into the iframe and handles the click on every a element
             */
            scope.loadUrl = function () {
                iframe[0].setAttribute('src', proxyUrl + scope.project.baseUrl + '/' + (scope.url === null ? '' : scope.url));
                iframe[0].onload = function () {
                    angular.element(iframe.contents()[0].body.getElementsByTagName('a'))
                        .on('click', function () {
                            if (!scope.isSelectable) {
                                var _this = this;
                                if (_this.getAttribute('href') !== '' && _this.getAttribute('href')[0] !== '#') {
                                    scope.$apply(function () {
                                        scope.url = decodeURIComponent(_this.getAttribute('href'))
                                            .replace(proxyUrl + scope.project.baseUrl + '/', '')
                                    })
                                }
                            }
                        }
                    )
                }
            };

            /**
             * Enables the selection mode and therefore adds events to the iframe
             */
            scope.toggleSelection = function () {
                if (!scope.isSelectable) {
                    var iframeBody = angular.element(iframe.contents()[0].body);
                    iframeBody.on('mousemove', handleMouseMove);
                    iframeBody.one('click', function (e) {
                        handleClick(e);
                        scope.$apply(function () {
                            scope.isSelectable = false;
                        });
                    });
                    angular.element(document.body).on('keyup', handleKeyUp);
                } else {
                    handleClick();
                    scope.selector = null;
                }
                scope.isSelectable = !scope.isSelectable;
            };


            /**
             * Makes the web element picker invisible and fires the close event
             */
            scope.close = function () {
                htmlElementPickerInstance.setUrl(scope.url);
                htmlElementPickerInstance.close();
            };

            /**
             * Makes the web element Picker invisible and fires the ok event with the selector of the element that was
             * selected. If no selector is defined, then it just closes the picker
             */
            scope.ok = function () {
                htmlElementPickerInstance.setUrl(scope.url);
                htmlElementPickerInstance.close({
                    xPath: scope.selector,
                    textContent: scope.textContent
                });
            };

            init();
        }
    }
}());