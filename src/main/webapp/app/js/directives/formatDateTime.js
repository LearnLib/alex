(function(){
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('formatDateTime', formatDateTime);

    function formatDateTime() {

        var directive = {
            scope: {
                date: '=formatDateTime',
                format: '=formatTo'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs){

        }
    }
}());