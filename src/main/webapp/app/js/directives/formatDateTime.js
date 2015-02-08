(function(){
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('formatDateTime', formatDateTime);

    function formatDateTime() {

        var directive = {
            scope: {
                date: '=formatDateTime'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs){

            var date = new Date(scope.date);
            var dateString = '';

            dateString += date.getDate() + '.';
            dateString += (date.getMonth() + 1) + '.';
            dateString += date.getFullYear() + ', ';
            dateString += date.getHours() + ':';
            dateString += date.getMinutes();

            el[0].innerHTML = dateString;
        }
    }
}());