(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('downloadSvg', downloadSvg);

    downloadSvg.$inject = ['FileDownloadService'];

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
}());