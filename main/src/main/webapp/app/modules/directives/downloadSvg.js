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
 * The directive that lets you directly download an SVG element from the html page into a file. It attaches a click
 * event to the element it was used on, that downloads the SVG. It can only be used as an attribute.
 *
 * Attribute 'downloadSvg' expects the id of the svg or a parent element
 * Attribute 'adjustSize' can be true or false, default is true
 *
 * Use: '<button download-svg="{{selector}}" adjust-size="{{true|false}}">Click Me!</button>'.
 *
 * @param FileDownloadService - The service for downloading files
 * @returns {{restrict: string, link: link}}
 */
// @ngInject
function downloadSvg(FileDownloadService) {
    return {
        restrict: 'A',
        scope: {
            downloadSvg: '@',
            adjustSize: '@'
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', function () {
            var svg;
            var adjustSize = scope.adjustSize !== 'false';

            // find the downloadable svg element
            if (scope.downloadSvg) {
                svg = document.querySelector(scope.downloadSvg);
                if (svg !== null && svg.nodeName.toLowerCase() === 'svg') {
                    FileDownloadService.downloadSVG(svg, adjustSize);
                } else {
                    svg = svg.querySelector('svg');
                    if (svg !== null) {
                        FileDownloadService.downloadSVG(svg, adjustSize);
                    }
                }
            }
        });
    }
}

export default downloadSvg;