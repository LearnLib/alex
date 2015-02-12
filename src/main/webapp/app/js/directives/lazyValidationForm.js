(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('lazyValidationForm', lazyValidationForm);

    function lazyValidationForm() {

        var directive = {
            restrict: 'A',
            scope: {
                form: '=lazyValidationForm',
                submit: '&onSubmit'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {
            if (attrs.name) {
                attrs.$set('novalidate', '');
                el.bind('submit', function () {
                    if (scope.form.$valid) {
                        scope.submit()();
                    } else {
                        scope.form.submitted = true;
                        scope.$apply();
                    }
                })
            }
        }
    }

}());