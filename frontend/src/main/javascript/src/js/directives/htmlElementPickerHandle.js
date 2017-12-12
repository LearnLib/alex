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

/**
 * The directive that creates a new HTML element picker. Can only be used as an attribute and attaches a click
 * event to the source element that opens the picker. On first start, it loads the page that is defined in the
 * projects baseUrl. On following calls the last visited page is loaded.
 *
 * Attribute 'model' is the model for the XPath.
 * Attribute 'text' is the model for the .textContent value of the selected element.
 *
 * Use: '<button html-element-picker model="..." text="...">Click Me!</button>'.
 *
 * @param $document
 * @param $compile
 * @param $q
 * @param HtmlElementPickerService
 * @returns {{restrict: string, scope: {selectorModel: string}, link: Function}}
 */
// @ngInject
export function htmlElementPickerHandle($document, $compile, $q, HtmlElementPickerService) {
    return {
        restrict: 'A',
        scope: {
            node: '=model',
            textModel: '=text'
        },
        link(scope, el) {
            el.on('click', () => {
                // make sure the element picker is not opened twice.
                if (document.getElementById("html-element-picker") !== null) {
                    return;
                }

                // create a new element picker under the current scope and append to the body
                const picker = $compile('<html-element-picker></html-element-picker>')(scope);
                $document.find('body').prepend(picker);

                HtmlElementPickerService.deferred = $q.defer();
                HtmlElementPickerService.deferred.promise
                    .then(data => {
                        // copy the selected selector and .textContent value to the scopes models
                        if (typeof scope.node !== "undefined") {
                            scope.node.selector = data.selector;
                            scope.node.type = data.selectorType;
                        }
                        if (typeof scope.textModel !== "undefined") {
                            scope.textModel = data.textContent;
                        }
                    })
                    .finally(() => {
                        picker.remove();
                    });
            });
        }
    };
}