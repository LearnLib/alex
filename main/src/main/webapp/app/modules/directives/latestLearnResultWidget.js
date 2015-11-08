(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('latestLearnResultWidget', latestLearnResultWidget);

    /**
     * The directive for the dashboard widget that displays information about the latest learning result, if there
     * exists one.
     *
     * Use: <dashboard-widget>
     *          <latest-learn-result-widget></latest-learn-result-widget>
     *      </dashboard-widget>
     *
     * @param SessionService - The SessionService
     * @param LearnResultResource - The LearnResult factory
     * @returns {{require: string, templateUrl: string, link: link}}
     */
    // @ngInject
    function latestLearnResultWidget(SessionService, LearnResultResource) {
        return {
            require: '^dashboardWidget',
            templateUrl: 'views/directives/latest-learn-result-widget.html',
            link: link
        };

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - The controller of dashboardWidget
         */
        function link(scope, el, attrs, ctrl) {
            ctrl.setWidgetTitle('Latest Learn Result');

            /**
             * The latest learning result
             * @type {null|LearnResult}
             */
            scope.result = null;

            LearnResultResource.getAllFinal(SessionService.project.get().id)
                .then(function (results) {
                    if (results.length > 0) {
                        scope.result = results[results.length - 1];
                    }
                })
        }
    }
}());