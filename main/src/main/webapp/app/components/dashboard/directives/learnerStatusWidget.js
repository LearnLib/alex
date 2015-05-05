(function () {
    'use strict';

    angular
        .module('ALEX.dashboard')
        .directive('learnerStatusWidget', learnerStatusWidget);

    learnerStatusWidget.$inject = ['LearnerService', 'ToastService'];

    /**
     * The directive of the dashboard widget that displays the current status of the learner
     *
     * Use: <dashboard-widget>
     *          <learner-status-widget></learner-status-widget>
     *      </dashboard-widget>
     *
     * @param Learner - The LearnerService
     * @param Toast - The ToastService
     * @returns {{require: string, templateUrl: string, link: link}}
     */
    function learnerStatusWidget(Learner, Toast) {
        return {
            require: '^dashboardWidget',
            templateUrl: 'app/components/dashboard/views/learner-status-widget.html',
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

            Learner.isActive().then(function (data) {
                scope.isActive = data.active;
                if (!data.active) {
                    Learner.getStatus()
                        .then(function (data) {
                            scope.hasFinished = data !== '';
                            scope.result = data;
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