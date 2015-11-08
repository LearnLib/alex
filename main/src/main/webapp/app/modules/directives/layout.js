(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .controller('LayoutController', ['$scope', function ($scope) {
            $scope.collapsed = false;

            this.toggleCollapsed = function () {
                $scope.collapsed = !$scope.collapsed;
            };

            this.isCollapsed = function () {
                return $scope.collapsed;
            }
        }])

        .directive('layout', function () {
            return {
                scope: {},
                controller: 'LayoutController'
            }
        })

        .directive('layoutToggleElement', function () {
            return {
                require: '^layout',
                link: function (scope, el, attrs, ctrl) {
                    scope.$watch(ctrl.isCollapsed, function (collapsed) {
                        if (collapsed) {
                            el.addClass('layout-collapsed');
                        } else {
                            el.removeClass('layout-collapsed');
                        }
                    });
                }
            }
        })

        .directive('layoutToggleButton', function () {
            return {
                require: '^layout',
                link: function (scope, el, attrs, ctrl) {
                    el.on('click', function () {
                        scope.$apply(function () {
                            ctrl.toggleCollapsed();
                        });
                    })
                }
            }
        })
}());