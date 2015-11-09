(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('checkbox', checkbox)
        .directive('checkboxMultiple', checkboxMultiple);

    /**
     * Directive for replacing the default input[type='checkbox'] element to make it look the same in all browsers.
     * Can select a single element and toggles the property '_selected' of it.
     *
     * The attribute 'model' should be the object that can be selected.
     *
     * Use: <checkbox model="..."></checkbox>
     *
     * @returns {{restrict: string, template: string, scope: {model: string}, link: link}}
     */
    function checkbox() {
        return {
            restrict: 'E',
            template: `
                <span class="alx-checkbox">
                    <i class="fa fa-fw" ng-class="model._selected ? 'fa-check-square-o':'fa-square-o'"></i>
                </span>
            `,
            scope: {
                model: '='
            },
            link: link
        };

        function link(scope, el) {
            el.on('click', handleClick);

            function handleClick() {
                scope.$apply(function () {
                    scope.model['_selected'] = !scope.model['_selected'];
                });
            }
        }
    }

    /**
     * Directive for replacing the default input[type='checkbox'] element to make it look the same in all browsers.
     * Allows the selection of multiple elements at once by toggling the property '_selected' of each object.
     *
     * The attribute 'model' should be an array of objects or a function that returns one
     *
     * Use: <checkbox-multiple model="..."></checkbox-multiple>
     *
     * @returns {{restrict: string, template: string, scope: {model: string}, link: link}}
     */
    function checkboxMultiple() {
        return {
            restrict: 'E',
            template: `
                <span class="alx-checkbox">
                    <i class="fa fa-fw" ng-class="checked ? 'fa-check-square-o' : 'fa-square-o'"></i>
                </span>
            `,
            scope: {
                model: '='
            },
            link: link
        };

        function link(scope, el) {
            scope.checked = false;

            el.on('click', handleClick);

            function handleClick() {
                scope.checked = !scope.checked;

                scope.$apply(function () {
                    var items = angular.isFunction(scope.model) ? scope.model() : scope.model;
                    for (var i = 0; i < items.length; i++) {
                        items[i]['_selected'] = scope.checked;
                    }
                })
            }
        }
    }
}());