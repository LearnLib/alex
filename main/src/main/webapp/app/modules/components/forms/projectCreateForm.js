import {events} from '../../constants';
import {ProjectFormModel} from '../../entities/Project';

/** The class of the project create form component */
// @ngInject
class ProjectCreateForm {

    /**
     * Constructor
     * @param ProjectResource
     * @param ToastService
     * @param EventBus
     */
    constructor(ProjectResource, ToastService, EventBus) {
        this.ProjectResource = ProjectResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The empty project model that is used for the form
         * @type {ProjectFormModel}
         */
        this.project = new ProjectFormModel();
    }

    /** Creates a new project */
    createProject() {
        this.ProjectResource.create(this.project)
            .then(createdProject => {
                this.ToastService.success(`Project "${createdProject.name}" created`);
                this.EventBus.emit(events.PROJECT_CREATED, {project: createdProject});
                this.project = new ProjectFormModel();
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message);
            });
    }
}

const projectCreateForm = {
    controller: ProjectCreateForm,
    controllerAs: 'vm',
    templateUrl: 'views/directives/project-create-form.html'
};

export default projectCreateForm;