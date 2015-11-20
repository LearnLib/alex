import _ from 'lodash';
import {events} from '../../constants';

/**
 * The controller that shows the page to manage projects
 */
// @ngInject
class ProjectsController {

    /**
     * Constructor
     * @param $scope
     * @param $state
     * @param SessionService
     * @param ProjectResource
     * @param EventBus
     * @param ToastService
     */
    constructor($scope, $state, SessionService, ProjectResource, EventBus, ToastService) {

        /**
         * The list of all projects
         * @type {Project[]}
         */
        this.projects = [];

        // go to the dashboard if there is a project in the session
        if (SessionService.project.get() !== null) {
            $state.go('dashboard');
            return;
        }

        //get all projects from the server
        ProjectResource.getAll()
            .then(projects => {
                this.projects = projects;
            })
            .catch(response => {
                ToastService.danger(`Loading project failed. ${response.data.message}`);
            });

        // listen on project create event
        EventBus.on(events.PROJECT_CREATED, (evt, data) => {
            this.projects.push(data.project);
        }, $scope);

        // listen on project update event
        EventBus.on(events.PROJECT_UPDATED, (evt, data) => {
            const project = data.project;
            const i = _.findIndex(this.projects, {id: project.id});
            if (i > -1) this.projects[i] = project;
        }, $scope);

        // listen on project delete event
        EventBus.on(events.PROJECT_DELETED, (evt, data) => {
            _.remove(this.projects, {id: data.project.id});
        }, $scope);
    }
}

export default ProjectsController;