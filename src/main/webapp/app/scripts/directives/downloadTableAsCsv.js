(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadTableAsCsv', downloadTableAsCsv);

    function downloadTableAsCsv() {
        return {
            link: link
        };

        function link(scope, el, attrs) {

        }
    }
}());