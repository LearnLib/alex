import {events} from '../../constants';
import {Project} from '../../entities/Project';

/**
 * The controller of the modal window for editing a project
 */
// @ngInject
class ProjectSettingsModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param ProjectResource
     * @param ToastService
     * @param EventBus
     */
    constructor($modalInstance, modalData, ProjectResource, ToastService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.ProjectResource = ProjectResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The project to edit
         * @type {Project}
         */
        this.project = modalData.project;

        /**
         * An error message that is displayed on a failed updated
         * @type {null|string}
         */
        this.error = null;
    }

    /** Updates the project. Closes the modal window on success. */
    updateProject () {
        this.error = null;

        this.ProjectResource.update(this.project)
            .then(updatedProject => {
                this.ToastService.success('Project updated');
                this.EventBus.emit(events.PROJECT_UPDATED, {project: updatedProject});
                this.$modalInstance.dismiss();
            })
            .catch(response => {
                this.error = response.data.message;
            })
    };

    /** Closes the modal window */
    close () {
        this.$modalInstance.dismiss();
    };
}

export default ProjectSettingsModalController;