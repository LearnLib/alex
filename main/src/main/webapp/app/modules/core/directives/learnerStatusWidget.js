(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('learnerStatusWidget', learnerStatusWidget);

    learnerStatusWidget.$inject = ['LearnerResource', 'ToastService', 'paths'];

    /**
     * The directive of the dashboard widget that displays the current status of the learner
     *
     * Use: <dashboard-widget>
     *          <learner-status-widget></learner-status-widget>
     *      </dashboard-widget>
     *
     * @param Learner - The LearnerResource
     * @param Toast - The ToastService
     * @param paths - The applications paths constant
     * @returns {{require: string, templateUrl: string, link: link}}
     */
    function learnerStatusWidget(Learner, Toast, paths) {
        return {
            require: '^dashboardWidget',
            templateUrl: paths.COMPONENTS + '/core/views/directives/learner-status-widget.html',
            link: link
        };

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - The controller of dashboardWidget
         */
        function link(scope, el, attrs, ctrl) {
            ctrl.setWidgetTitle('Learner Status');

            /**
             * Whether the learner is actively learning an application
             * @type {boolean}
             */
            scope.isActive = false;

            /**
             * Whether the learner has finished learning an application
             * @type {boolean}
             */
            scope.hasFinished = false;

            /**
             * The intermediate or final learning result
             * @type {null|LearnResult}
             */
            scope.result = null;

            Learner.isActive()
                .then(function (data) {
                    scope.isActive = data.active;
                    if (!data.active) {
                        Learner.getStatus()
                            .then(function (data) {
                                if (data !== null) {
                                    scope.hasFinished = true;
                                    scope.result = data;
                                }
                            });
                    }
                });

            /**
             * Induces the Learner to stop learning after the current hypothesis model
             */
            scope.abort = function () {
                Learner.stop().then(function () {
                    Toast.info('The Learner stops with the next hypothesis');
                })
            }
        }
    }
}());