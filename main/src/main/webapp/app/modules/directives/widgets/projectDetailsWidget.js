import {events} from '../../constants';

/**
 * The directive for the dashboard widget that displays information about the current project.
 *
 * Use: <project-details-widget></project-details-widget>
 */
// @ngInject
class ProjectDetailsWidget {

    /**
     * Constructor
     * @param $scope
     * @param SessionService
     * @param SymbolGroupResource
     * @param LearnResultResource
     * @param EventBus
     */
    constructor($scope, SessionService, SymbolGroupResource, LearnResultResource, EventBus) {

        /**
         * The project in sessionStorage
         * @type {Project}
         */
        this.project = SessionService.project.get();

        /**
         * The number of symbol groups of the project
         * @type {null|number}
         */
        this.numberOfGroups = null;

        /**
         * The number of visible symbols of the project
         * @type {null|number}
         */
        this.numberOfSymbols = null;

        /**
         * The number of persisted test runs in the database
         * @type {null|number}
         */
        this.numberOfTests = null;

        SymbolGroupResource.getAll(this.project.id, true)
            .then(groups => {
                this.numberOfGroups = groups.length;
                let counter = 0;
                groups.forEach(g => counter += g.symbols.length);
                this.numberOfSymbols = counter;
            });

        LearnResultResource.getAllFinal(this.project.id)
            .then(results => {
                this.numberOfTests = results.length;
            });

        // listen on project update event
        EventBus.on(events.PROJECT_UPDATED, (evt, data) => {
            this.project = data.project;
            SessionService.project.save(data.project);
        }, $scope);
    }
}

const projectDetailsWidget = {
    controller: ProjectDetailsWidget,
    controllerAs: 'vm',
    template: `
        <widget title="Project details">
            <table class="table table-condensed">
                <tbody>
                <tr>
                    <td><strong>Name</strong></td>
                    <td ng-bind="vm.project.name"></td>
                </tr>
                <tr>
                    <td><strong>URL</strong></td>
                    <td><a href="{{vm.project.baseUrl}}" target="_blank" ng-bind="vm.project.baseUrl"></a></td>
                </tr>
                <tr>
                    <td><strong>#Groups</strong></td>
                    <td ng-bind="vm.numberOfGroups"></td>
                </tr>
                <tr>
                    <td><strong>#Symbols</strong></td>
                    <td ng-bind="vm.numberOfSymbols"></td>
                </tr>
                <tr>
                    <td><strong>#Tests</strong></td>
                    <td ng-bind="vm.numberOfTests"></td>
                </tr>
                </tbody>
            </table>
            <button class="btn btn-default btn-xs" project-settings-modal-handle project="vm.project">
                <i class="fa fa-fw fa-edit"></i> Edit project
            </button>
        </widget>
    `
};

export default projectDetailsWidget;