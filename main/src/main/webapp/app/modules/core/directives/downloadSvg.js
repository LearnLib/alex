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
     * Expects an attribute 'ancestorOrElement' whose value should be the selector of the SVG or of an ancestor of an
     * svg.
     *
     * Use: '<button download-svg ancestor-or-element="#...">Click Me!</button>'.
     *
     * @param FileDownloadService - The service for downloading files
     * @returns {{restrict: string, link: link}}
     */
    function downloadSvg(FileDownloadService) {
        return {
            restrict: 'A',
            scope: {
                ancestorOrElement: '@'
            },
            link: link
        };

        function link(scope, el) {
            el.on('click', function () {
                var svg;

                // find the downloadable svg element
                if (scope.ancestorOrElement) {
                    svg = document.querySelector(scope.ancestorOrElement);
                    if (svg !== null && svg.nodeName.toLowerCase() === 'svg') {
                        FileDownloadService.downloadSVG(svg);
                    } else {
                        svg = svg.querySelector('svg');
                        if (svg !== null) {
                            FileDownloadService.downloadSVG(svg);
                        }
                    }
                }
            });
        }
    }
}());