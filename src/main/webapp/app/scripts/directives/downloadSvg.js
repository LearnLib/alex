(function () {

    angular
        .module('weblearner.directives')
        .directive('downloadSvg', downloadSvg);

    downloadSvg.$inject = ['PromptService'];

    /**
     * The directive that lets you directly download a svg element from the html page into a file. It attaches a click
     * event to the element it was used on, that first prompts you for a filename and then downloads the svg.
     *
     * It can only be used as an attribute and the value of the attribute should be a css selector that leads either
     * directly to svg or to a parent element of the svg. When the selector point the the parent and the parent has
     * multiple svg children, only the first one will be downloaded.
     *
     * Use the directive for example like this: '<button download-svg="#svg">download</button>'.
     *
     * @param PromptService - The service for prompting a user input
     * @returns {{restrict: string, link: link}}
     */
    function downloadSvg(PromptService) {

        var directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            el.on('click', handleDirectiveBehavior);

            /**
             * Makes sure that the required attribute has a value and that a svg element actually exists. Prompts the
             * user to enter a filename and calls the download function on success
             */
            function handleDirectiveBehavior() {
                var svg = null;

                if (angular.isDefined(attrs.downloadSvg)) {
                    svg = findSvg(attrs.downloadSvg);

                    if (svg !== null) {
                        PromptService.prompt('Enter a name for the svg file.', {
                            regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                            errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
                        }).then(function (filename) {
                            download(svg, filename);
                        });
                    }
                }
            }

            /**
             * Checks if the element of the passed selector already is a svg element and if not, searches for a svg
             * element in the dom tree below the element and returns the first occurrence.
             *
             * @param selector - The selector where a svg element should be looked for
             * @returns {*|null} - The first occurrence of an svg
             */
            function findSvg(selector) {
                var svg = document.querySelector(selector);
                if (svg !== null) {
                    if (svg.nodeName.toLowerCase() !== 'svg') {
                        svg = svg.querySelector('svg')
                    }
                    if (svg !== null) {
                        return svg;
                    }
                }
                return null;
            }

            /**
             * Directly downloads a svg element
             *
             * @param svg - The svg element that should be downloaded
             * @param filename - The name the file should have
             */
            function download(svg, filename) {

                // set proper xml attributes for downloadable file
                svg.setAttribute('version', '1.1');
                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                // create serialized string from svg element and encode it in
                // base64 otherwise the file will not be completely downloaded
                // what results in errors opening the file
                var svgString = new XMLSerializer().serializeToString(svg);
                var encodedSvgString = window.btoa(svgString);

                // create new link element with image data
                var a = document.createElement('a');
                a.style.display = 'none';
                a.setAttribute('href', 'data:image/svg+xml;base64,\n' + encodedSvgString);
                a.setAttribute('target', '_blank');
                a.setAttribute('download', filename + '.svg');

                // append link to the dom, fire click event and remove it
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }
}());