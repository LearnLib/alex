(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('dashboardWidget', dashboardWidget);

    dashboardWidget.$inject = ['paths'];

    /**
     * The directive that is used as a container for a widget that is displayed on the dashboard. Child directives
     * should require it with require: '^dashboardWidget'
     *
     * Use: <dashboard-widget> ... </dashboard-widget>
     *
     * @returns {{scope: {}, transclude: boolean, templateUrl: string, controller: *[]}}
     */
    function dashboardWidget(paths) {
        return {
            scope: {},
            transclude: true,
            templateUrl: paths.COMPONENTS + '/dashboard/views/dashboard-widget.html',
            controller: ['$scope', controller]
        };

        /**
         * The controller for the widget that child directives have to implement
         *
         * @param $scope
         */
        function controller($scope) {

            /**
             * The title of the widget
             * @type {null|string}
             */
            $scope.title = null;

            /**
             * Sets the widgets title
             * @param {string} title - The title of the widget
             */
            this.setWidgetTitle = function (title) {
                $scope.title = title;
            }
        }
    }
}());