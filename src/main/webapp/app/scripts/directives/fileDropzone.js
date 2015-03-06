(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('fileDropzone', fileDropzone);

    /**
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

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            var _reader = new FileReader();

            _reader.onload = function (e) {
                scope.onLoaded()(e.target.result);
            };

            el.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            el.on('dragenter', function(){
                el[0].style.outline = '2px solid rgba(0,0,0,0.2)'
            }).on('dragleave', function(){
                el[0].style.outline = '0'
            });

            el.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                el[0].style.outline = '0'
                readFiles(e.dataTransfer.files);
            });

            /**
             * Read files as a text file
             *
             * @param files
             */
            function readFiles(files) {
                for (var i = 0; i < files.length; i++) {
                    _reader.readAsText(files[i]);
                }
            }
        }
    }
}());