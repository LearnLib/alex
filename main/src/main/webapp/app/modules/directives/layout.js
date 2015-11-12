function layout() {
    return {
        scope: {},
        controller: controller
    };

    // @ngInject
    function controller($scope) {
        $scope.collapsed = false;

        this.toggleCollapsed = function () {
            $scope.collapsed = !$scope.collapsed;
        };

        this.isCollapsed = function () {
            return $scope.collapsed;
        }
    }
}

function layoutToggleElement() {
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
}

function layoutToggleButton() {
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
}

export {layout, layoutToggleElement, layoutToggleButton};