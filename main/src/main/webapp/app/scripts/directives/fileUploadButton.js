(function(){
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('fileUploadButton', fileUploadButton);

    /**
     * Directive as a replacement for <input type="file"/>. Can only be used as an attribute and loads file as strings.
     *
     * Attribute onLoaded should be the callback with one parameter where the string is passed
     *
     * Use: <button file-upload-button on-loaded="...">Choose File</button>
     *
     * @returns {{restrict: string, scope: {onLoaded: string}, link: link}}
     */
    function fileUploadButton() {
        return {
            restrict: 'A',
            scope: {
                onLoaded: '&'
            },
            link: link
        };
        function link(scope, el, attrs) {
            var reader = new FileReader();

            // call the callback with the loaded text string
            reader.onload = function (e) {
                if (angular.isDefined(scope.onLoaded)) {
                    scope.onLoaded()(e.target.result);
                }
            };

            // create input field and simulate click
            el.on('click', function(){
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.addEventListener('change', handleFileSelect, false);
                input.click();
            });

            // read files from input
            function handleFileSelect(e) {
                var files = e.target.files;
                for(var i = 0; i < files.length; i++) {
                    reader.readAsText(files[i]);
                }
            }
        }
    }
}());