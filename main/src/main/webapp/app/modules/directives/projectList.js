import {events} from '../constants';

/**
 * The directive that displays a list of projects.
 *
 * Usage: <project-list projects="..."></project-list> where property 'projects' expects an array of projects.
 *
 * @param $state
 * @param ProjectResource
 * @param ToastService
 * @param SessionService
 * @param PromptService
 * @param EventBus
 * @returns {{scope: {projects: string}, templateUrl: string, link: link}}
 */
// @ngInject
function projectList($state, ProjectResource, ToastService, SessionService, PromptService, EventBus) {
    return {
        scope: {
            projects: '='
        },
        templateUrl: 'views/directives/project-list.html',
        link: link
    };

    function link(scope) {

        /**
         * Save a project into the sessionStorage and redirect to its dashboard
         * @param {Project} project - The project to work on
         */
        scope.openProject = function (project) {
            SessionService.project.save(project);
            $state.go('dashboard');
        };

        /**
         * Deletes a project
         * @param {Project} project - The project to delete
         */
        scope.deleteProject = function (project) {
            PromptService.confirm('Do you really want to delete this project? All related data will be lost.')
                .then(() => {
                    ProjectResource.delete(project)
                        .then(() => {
                            ToastService.success('Project ' + project.name + ' deleted');
                            EventBus.emit(events.PROJECT_DELETED, {project: project});
                        })
                })
        }
    }
}

export default projectList;