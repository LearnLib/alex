(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadCanvasAsImage', [
            'PromptService',
            downloadCanvasAsImage
        ]);

    /**
     * downloadCanvasAsImage
     *
     * The directive to download a given canvas as a png file. Add this directive as an attribute to any kind of
     * element, best on a button. The directive adds an click event to the element of the directive.
     *
     * @param PromptService
     * @returns {{link: link}}
     */
    function downloadCanvasAsImage(PromptService) {

        var directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope - the scope
         * @param el - the element of the directive
         * @param attrs - the attributes of the element
         */
        function link(scope, el, attrs) {

            el.on('click', promptFileName);

            //////////

            /**
             * Prompt the user for a file name for the image of the chart
             */
            function promptFileName() {
                PromptService.prompt('Enter a name for the chart image file.', {
                    regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                    errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
                }).then(download);
            }

            /**
             * Download the canvas whose id was passed as an attribute from this directive as png
             */
            function download(filename) {

                // make sure the id was passed
                if (attrs.downloadCanvasAsImage) {

                    // find canvas
                    var canvas = document.getElementById(attrs.downloadCanvasAsImage);

                    if (canvas != null) {

                        // create image data with highest quality
                        var img = canvas.toDataURL('image/png', 1.0);

                        // create hidden link element with the data of the image and click on it
                        var a = document.createElement('a');
                        a.setAttribute('href', img);
                        a.setAttribute('download', filename + '.png');
                        a.setAttribute('target', '_blank');
                        a.click();
                    }
                }
            }
        }
    }
}());