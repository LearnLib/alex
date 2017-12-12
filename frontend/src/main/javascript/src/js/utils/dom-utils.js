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
 * Class for working with the DOM.
 */
export class DomUtils {

    /**
     * Get the unique CSS selector from a selected element.
     * http://stackoverflow.com/questions/4588119/get-elements-css-selector-without-element-id
     *
     * @param el - The element to get the unique css path from.
     * @returns {string} - The unique css path ot the element.
     */
    static getCssPath(el) {
        const names = [];
        while (el.parentNode) {
            if (el.id) {
                names.unshift('#' + el.id);
                break;
            } else {
                if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
                else {
                    for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++) ;
                    names.unshift(el.tagName + ":nth-child(" + c + ")");
                }
                el = el.parentNode;
            }
        }
        return names.join(" > ");
    }

    /**
     * Get the unique xpath to a selected element.
     *
     * @param el - The element to get the xpath from.
     * @return {string} - The xpath ot the element.
     */
    static getXPath(el) {
        const names = [];
        while (el.parentNode) {
            if (el.id) {
                names.unshift('//' + el.nodeName.toLowerCase() + '[@id=\'' + el.id + '\']');
                break;
            } else {
                if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
                else {
                    for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++) ;
                    names.unshift(el.nodeName.toLowerCase() + '[' + c + ']');
                }
                el = el.parentNode;
            }
        }
        return names.join("/");
    }
}