/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// the promise that is used to communicate between the picker and the handle
let deferred = null;

// the url that was opened until the picker got closed
let lastUrl = null;

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
 * @param $document
 * @param $compile
 * @param $q
 * @returns {{restrict: string, scope: {selectorModel: string}, link: Function}}
 */
// @ngInject
function htmlElementPicker($document, $compile, $q) {
    return {
        restrict: 'A',
        scope: {
            selectorModel: '=model',
            textModel: '=text'
        },
        link: link
    };

    function link(scope, el) {

        // The HTML picker element that is dynamically appended and removed to/from the pages DOM tree
        let picker;

        el.on('click', () => {

            // create a new element picker under the current scope and append to the body
            picker = $compile('<html-element-picker-window></html-element-picker-window>')(scope);
            $document.find('body').prepend(picker);

            deferred = $q.defer();
            deferred.promise
                .then(data => {

                    // copy the selected XPath and .textContent value to the scopes models
                    if (angular.isDefined(scope.selectorModel)) {
                        scope.selectorModel = data.xPath;
                    }
                    if (angular.isDefined(scope.textModel)) {
                        scope.textModel = data.textContent;
                    }
                })
                .finally(() => {
                    picker.remove();
                });
        });
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
 * @returns {{scope: {}, templateUrl: string, link: link}}
 */
// @ngInject
function htmlElementPickerWindow($window, SessionService) {
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
            if (lastTarget === e.target) {
                return false;
            } else {
                if (lastTarget !== null) {
                    lastTarget.style.outline = '0px';
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
            scope.project = SessionService.getProject();
            proxyUrl = $window.location.origin + 'rest/proxy?url=';

            scope.url = lastUrl;
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
                                            .replace(proxyUrl + scope.project.baseUrl + '/', '');
                                    });
                                }
                            }
                        }
                    );
            };
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
            lastUrl = scope.url;
            deferred.reject();
        };

        /**
         * Makes the web element Picker invisible and fires the ok event with the selector of the element that was
         * selected. If no selector is defined, then it just closes the picker
         */
        scope.ok = function () {
            lastUrl = scope.url;
            deferred.resolve({
                xPath: scope.selector,
                textContent: scope.textContent
            });
        };

        init();
    }
}

export {htmlElementPicker, htmlElementPickerWindow};