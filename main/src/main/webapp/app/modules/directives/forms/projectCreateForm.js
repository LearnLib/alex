import {events} from '../../constants';
import {ProjectFormModel} from '../../entities/Project';

/**
 * The directive that renders the form to create a new project.
 *
 * Usage: <project-create-form></project-create-form>
 *
 * @param ProjectResource
 * @param ToastService
 * @param EventBus
 * @returns {{scope: {}, templateUrl: string, link: link}}
 */
// @ngInject
function projectCreateForm(ProjectResource, ToastService, EventBus) {
    return {
        scope: {},
        templateUrl: 'views/directives/project-create-form.html',
        link: link
    };

    function link(scope) {

        /**
         * The empty project model that is used for the form
         * @type {Project}
         */
        scope.project = new ProjectFormModel();

        /** Creates a new project */
        scope.createProject = function () {
            ProjectResource.create(scope.project)
                .then(createdProject => {
                    ToastService.success('Project "' + createdProject.name + '" created');
                    EventBus.emit(events.PROJECT_CREATED, {project: createdProject});
                    scope.project = new ProjectFormModel();
                })
                .catch(response => {
                    ToastService.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message)
                })
        }
    }
}

export default projectCreateForm;