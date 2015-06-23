(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('projectDetailsWidget', projectDetailsWidget);

    projectDetailsWidget.$inject = ['SessionService', 'SymbolGroupResource', 'LearnResultResource', 'paths'];

    /**
     * The directive for the dashboard widget that displays information about the current project.
     *
     * Use: <dashboard-widget>
     *          <project-details-widget></project-details-widget>
     *      </dashboard-widget>
     *
     * @param Session - The SessionService
     * @param SymbolGroupResource - The SymbolGroup Resource
     * @param LearnResultResource - The LearnResult Resource
     * @param paths - The applications paths constant
     * @returns {{require: string, templateUrl: string, link: link}}
     */
    function projectDetailsWidget(Session, SymbolGroupResource, LearnResultResource, paths) {
        return {
            require: '^dashboardWidget',
            templateUrl: paths.COMPONENTS + '/core/views/directives/project-details-widget.html',
            link: link
        };

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - The dashboardWidget controller
         */
        function link(scope, el, attrs, ctrl) {
            ctrl.setWidgetTitle('About this Project');

            /**
             * The project in sessionStorage
             * @type {Project}
             */
            scope.project = Session.project.get();

            /**
             * The number of symbol groups of the project
             * @type {null|number}
             */
            scope.numberOfGroups = null;

            /**
             * The number of visible symbols of the project
             * @type {null|number}
             */
            scope.numberOfSymbols = null;

            /**
             * The number of persisted test runs in the database
             * @type {null|number}
             */
            scope.numberOfTests = null;

            SymbolGroupResource.getAll(scope.project.id, {embedSymbols: true})
                .then(function (groups) {
                    scope.numberOfGroups = groups.length;
                    var counter = 0;
                    for (var i = 0; i < groups.length; i++) {
                        counter += groups[i].symbols.length;
                    }
                    scope.numberOfSymbols = counter;
                });

            LearnResultResource.getAllFinal(scope.project.id)
                .then(function (results) {
                    scope.numberOfTests = results.length;
                })
        }
    }
}());