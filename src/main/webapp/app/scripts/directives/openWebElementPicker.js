(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openWebElementPicker', [
            'WebElementPickerService',
            openWebElementPicker
        ]);

    function openWebElementPicker(WebElementPickerService) {

        var directive = {
            scope: {
                url: '=',
                selector: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', WebElementPickerService.open);

            //////////

            scope.$on('webElementPicker.ok', ok);

            //////////

            function ok(event, data) {
                scope.url = data.url;
                scope.selector = data.selector;
            }
        }
    }
}());