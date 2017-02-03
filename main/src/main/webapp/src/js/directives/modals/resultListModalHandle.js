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
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(modalData, $uibModalInstance, EventBus, ProjectResource, LearnResultResource, ToastService) {
        this.results = modalData.results;
        this.$uibModalInstance = $uibModalInstance;
        this.EventBus = EventBus;
        this.LearnResultResource = LearnResultResource;
        this.projects = [];
        this.ToastService = ToastService;

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
     * Loads a hypothesis from a json file.
     * @param {string} hypothesis - The hypothesis as string
     */
    loadResultFromFile(hypothesis) {
        try {
            this.EventBus.emit(events.RESULT_SELECTED, {result: {
                steps: [{hypothesis: JSON.parse(hypothesis)}]
            }});
            this.close();
        } catch(e) {
            this.ToastService.danger('Could not parse the file.')
        }
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
                    templateUrl: 'html/directives/modals/result-list-modal.html',
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