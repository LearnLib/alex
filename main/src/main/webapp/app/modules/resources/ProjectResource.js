import {Project} from '../entities/Project';

/**
 * The resource that handles http calls to the API to do CRUD operations on projects
 */
// @ngInject
class ProjectResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Get all projects of a user
     * @returns {*}
     */
    getAll() {
        return this.$http.get('/rest/projects')
            .then(response => response.data.map(p => new Project(p)));
    }

    /**
     * Creates a new project
     * @param {ProjectFormModel} project - The project to create
     * @returns {*}
     */
    create(project) {
        return this.$http.post('/rest/projects', project)
            .then(response => new Project(response.data));
    }

    /**
     * Updates a single project
     * @param {Project} project - The updated project
     * @returns {*}
     */
    update(project) {
        return this.$http.put(`/rest/projects/${project.id}`, project)
            .then(response => new Project(response.data));
    }

    /**
     * Deletes a single project from the server
     * @param {Project} project - The project to delete
     * @returns {*}
     */
    remove(project) {
        return this.$http.delete(`/rest/projects/${project.id}`);
    }
}

export default ProjectResource;