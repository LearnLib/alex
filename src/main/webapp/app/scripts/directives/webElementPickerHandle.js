(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webElementPickerHandle', webElementPickerHandle);

    webElementPickerHandle.$inject = ['WebElementPickerService'];

    /**
     * The handle for the web element picker. Adds an click event to the attached element that opens the web element
     * picker.
     *
     * Accepts an attribute 'selector' that should be the model where the XPath of the selected element should be
     * stored into.
     *
     * Use it like '<button web-element-picker-handle selector="..."></button>'
     *
     * @param WebElementPickerService - The service for the web element picker
     * @returns {{scope: {selector: string}, link: link}}
     */
    function webElementPickerHandle(WebElementPickerService) {

        var directive = {
            scope: {
                selector: '='
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs) {
            el.on('click', WebElementPickerService.open);

            scope.$on('webElementPicker.ok', function (e, data) {
                scope.selector = data.selector;
            });
        }
    }
}());