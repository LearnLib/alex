(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('projectDetailsWidget', projectDetailsWidget);

    const template = `
        <table class="table table-condensed">
            <tbody>
            <tr>
                <td><strong>Name</strong></td>
                <td ng-bind="::project.name"></td>
            </tr>
            <tr>
                <td><strong>URL</strong></td>
                <td><a href="{{::project.baseUrl}}" target="_blank" ng-bind="::project.baseUrl"></a></td>
            </tr>
            <tr>
                <td><strong>#Groups</strong></td>
                <td ng-bind="numberOfGroups"></td>
            </tr>
            <tr>
                <td><strong>#Symbols</strong></td>
                <td ng-bind="numberOfSymbols"></td>
            </tr>
            <tr>
                <td><strong>#Tests</strong></td>
                <td ng-bind="numberOfTests"></td>
            </tr>
            </tbody>
        </table>
    `;

    /**
     * The directive for the dashboard widget that displays information about the current project.
     *
     * Use: <widget title="...">
     *          <project-details-widget></project-details-widget>
     *      </widget>
     *
     * @param SessionService - The SessionService
     * @param SymbolGroupResource - The SymbolGroup Resource
     * @param LearnResultResource - The LearnResult Resource
     * @returns {{scope: {}, template: string, link: link}}
     */
    // @ngInject
    function projectDetailsWidget(SessionService, SymbolGroupResource, LearnResultResource) {
        return {
            scope: {},
            template: template,
            link: link
        };

        function link(scope) {

            /**
             * The project in sessionStorage
             * @type {Project}
             */
            scope.project = SessionService.project.get();

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