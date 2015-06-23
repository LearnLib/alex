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
     * Use: '<button download-svg="{{selector}}">Click Me!</button>'.
     *
     * @param FileDownloadService - The service for downloading files
     * @returns {{restrict: string, link: link}}
     */
    function downloadSvg(FileDownloadService) {
        return {
            restrict: 'A',
            scope: {
                downloadSvg: '@'
            },
            link: link
        };

        function link(scope, el) {
            el.on('click', function () {
                var svg;

                // find the downloadable svg element
                if (scope.downloadSvg) {
                    svg = document.querySelector(scope.downloadSvg);
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