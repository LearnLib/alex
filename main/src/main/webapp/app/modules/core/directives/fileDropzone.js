(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('fileDropzone', fileDropzone);

    /**
     * This directives makes any element a place to drop files from the local pc. Currently this directive only
     * supports to read files as a text. It can only be used as an attribute.
     *
     * Attribute 'onLoaded' expects to be a function with one parameter that represents the value of the loaded
     * file as string
     *
     * Use: '<div file-dropzone on-loaded="load">' with function load(contents) { ... }
     *
     * @return {{restrict: string, scope: {onLoaded: string}, link: link}}
     */
    function fileDropzone() {
        return {
            restrict: 'A',
            scope: {
                onLoaded: '&'
            },
            link: link
        };
        function link(scope, el) {
            var reader = new FileReader();

            // call the callback as soon as a file is loaded
            reader.onload = function (e) {
                if (angular.isDefined(scope.onLoaded)) {
                    scope.onLoaded()(e.target.result);
                }
            };

            // attach some styles to the element on dragover etc.
            el.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            el.on('dragenter', function () {
                el[0].style.outline = '2px solid rgba(0,0,0,0.2)';
            }).on('dragleave', function () {
                el[0].style.outline = '0';
            });

            el.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                el[0].style.outline = '0';
                readFiles(e.dataTransfer.files);
            });

            /**
             * Read files as a text file
             *
             * @param files
             */
            function readFiles(files) {
                for (var i = 0; i < files.length; i++) {
                    reader.readAsText(files[i]);
                }
            }
        }
    }
}());