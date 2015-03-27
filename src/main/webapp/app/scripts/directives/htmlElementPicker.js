(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('htmlElementPicker', htmlElementPicker)
        .directive('htmlElementPickerWindow', htmlElementPickerWindow)
        .factory('htmlElementPickerInstance', htmlElementPickerInstance);

    htmlElementPicker.$inject = ['$document', '$compile', 'htmlElementPickerInstance'];
    htmlElementPickerWindow.$inject = ['$window', 'SessionService', 'paths', 'htmlElementPickerInstance'];
    htmlElementPickerInstance.$inject = ['$q'];

    /**
     * @param $document
     * @param $compile
     * @param htmlElementPickerInstance
     * @returns {{restrict: string, scope: {selectorModel: string}, link: Function}}
     */
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
            var picker;

            el.on('click', function () {
                picker = $compile('<html-element-picker-window></html-element-picker-window>')(scope);
                $document.find('body').prepend(picker);

                htmlElementPickerInstance.open()
                    .then(function (data) {
                        if (angular.isDefined(scope.selectorModel)) {
                            scope.selectorModel = data.xPath;
                        }
                        if (angular.isDefined(scope.textModel)) {
                            scope.textModel = data.textContent;
                        }
                    })
                    .finally(function () {
                        picker.remove();
                    })
            })
        }
    }

    /**
     * The instance for the HTML element picker that holds the promise and the last url
     *
     * @returns {{close: Function, open: Function, setUrl: Function, getUrl: Function}}
     */
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

        function close(data) {
            if (angular.isDefined(data)) {
                deferred.resolve(data)
            } else {
                deferred.reject();
            }
        }

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

    function htmlElementPickerWindow($window, Session, paths, htmlElementPickerInstance) {

        return {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/html-element-picker.html',
            link: link
        };

        function link(scope, el, attrs) {

            // the iframe where the projects site gets loaded into
            var iframe = el.find('iframe');

            // when moving with the mouse over an element, this elements gets saved in this variable in order to
            // prevent multiple calls of getCssPath for the same element
            var lastTarget = null;

            // the project that is stored in the session
            var project = null;

            // the url of the proxy
            var proxyUrl = null;

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
                scope.textContent = lastTarget.textContent;
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

            // init
            function init() {
                project = Session.project.get();
                proxyUrl = $window.location.origin + paths.api.PROXY_URL;

                scope.url = htmlElementPickerInstance.getUrl();
                scope.loadUrl();
            }

            /**
             * Loads an entered url into the iframe and handles the click on every a element
             */
            scope.loadUrl = function () {
                iframe[0].setAttribute('src', proxyUrl + project.baseUrl + '/' + (scope.url === null ? '' : scope.url));
                iframe[0].onload = function () {
                    angular.element(iframe.contents()[0].body.getElementsByTagName('a'))
                        .on('click', function () {
                            var _this = this;
                            if (_this.getAttribute('href') !== '' && _this.getAttribute('href') !== '#') {
                                scope.$apply(function () {
                                    scope.url = decodeURIComponent(_this.getAttribute('href'))
                                        .replace(proxyUrl + project.baseUrl + '/', '')
                                })
                            }
                        }
                    )
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

            // init directive
            init();
        }
    }
}());