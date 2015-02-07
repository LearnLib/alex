(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('fileDropzone', fileDropzone);

    /**
     * fileDropzone
     *
     * This directives makes any element a place to drop files from the local pc. Currently this directive only
     * supports to read files as a text.
     *
     * @return {{restrict: string, scope: {onLoaded: string}, link: link}}
     */
    function fileDropzone() {

        var directive = {
            restrict: 'A',
            scope: {
                onLoaded: '&'
            },
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            var _reader = new FileReader();

            //////////

            // call function that was passed as onLoaded with the result of the FileReader
            _reader.onload = function (e) {
                scope.onLoaded()(e.target.result);
            };

            // add dragover event
            el.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            el.on('dragenter', function(){
                el[0].style.outline = '4px solid rgba(0,0,0,0.2)'
            }).on('dragleave', function(){
                el[0].style.outline = '0'
            });

            // add drop event and read files
            el.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                readFiles(e.dataTransfer.files);
                el[0].style.outline = '0'
            });

            //////////

            /**
             * Read files as a text file
             * @param files
             */
            function readFiles(files) {
                _.forEach(files, function (file) {
                    _reader.readAsText(file);
                })
            }
        }
    }
}());