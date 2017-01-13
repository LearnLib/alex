import {events} from "../../constants";

/**
 * The controller for the modal that displays a selectable list of results.
 */
export class ResultListModalController {

    /**
     * Constructor.
     *
     * @param modalData
     * @param $uibModalInstance
     * @param {EventBus} EventBus
     * @param {ProjectResource} ProjectResource
     * @param {LearnResultResource} LearnResultResource
     */
    // @ngInject
    constructor(modalData, $uibModalInstance, EventBus, ProjectResource, LearnResultResource) {
        this.results = modalData.results;
        this.$uibModalInstance = $uibModalInstance;
        this.EventBus = EventBus;
        this.LearnResultResource = LearnResultResource;
        this.projects = [];

        ProjectResource.getAll()
            .then(projects => this.projects = projects)
            .catch(err => console.log(err));
    }

    /** Switches the view. */
    switchProject() {
        this.results = null;
    }

    /**
     * Selects a project of which the learn results should be displayed.
     * @param {Project} project
     */
    selectProject(project) {
        this.LearnResultResource.getAll(project.id)
            .then(results => this.results = results)
            .catch(err => console.log(err));
    }

    /**
     * Emits the selected result and closes the modal.
     * @param {LearnResult} result
     */
    selectResult(result) {
        this.EventBus.emit(events.RESULT_SELECTED, {result: result});
        this.close();
    }

    /**
     * Closes the modal.
     */
    close() {
        this.$uibModalInstance.dismiss();
    }
}

// @ngInject
export function resultListModalHandle($uibModal) {
    return {
        scope: {
            results: '='
        },
        restrict: 'A',
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    template: `
                        <div class="modal-header">
                            <a class="btn btn-default btn-icon pull-right" ng-click="vm.close()">
                                <i class="fa fa-close fa-fw"></i>
                            </a>
                            <h4>
                                <strong ng-if="vm.results">Select a result</strong>
                                <strong ng-if="!vm.results">Select a project</strong>
                            </h4>
                        </div>
                        <div class="modal-body">
                            <div ng-if="vm.results">
                                <button class="btn btn-sm btn-primary" ng-click="vm.switchProject()">
                                    <i class="fa fa-fw fa-exchange"></i> Change project
                                </button>
                                <hr>
                                <div class="list-group">
                                    <a class="list-group-item" ng-repeat="result in vm.results | orderBy:'-testNo':false" ng-click="vm.selectResult(result)">
                                        <span class="label label-danger pull-right" ng-show="result.error">Failed</span>
                                        <strong>Test No <span ng-bind="result.testNo"></span></strong>,
                                        [<span ng-bind="(result.algorithm|formatAlgorithm)"></span>]
                                        <br>
                                        <p class="text-muted" style="margin-bottom: 0">
                                            Started: <span ng-bind="(result.statistics.startDate | date : 'EEE, dd.MM.yyyy, HH:mm')"></span>
                                        </p>
                                    </a>
                                </div>
                            </div>
                            <div class="list-group" ng-if="!vm.results">
                                <a class="list-group-item" ng-repeat="project in vm.projects" ng-click="vm.selectProject(project)">
                                    <strong ng-bind="project.name"></strong><br>
                                    <span class="text-muted" ng-bind="project.baseUrl"></span>
                                </a>
                            </div>
                        </div>
                    `,
                    controller: ResultListModalController,
                    controllerAs: 'vm',
                    resolve: {
                        modalData: function () {
                            return {results: scope.results};
                        }
                    }
                });
            });
        }
    };
}