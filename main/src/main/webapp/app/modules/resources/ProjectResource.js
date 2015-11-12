/**
 * The resource that handles http calls to the API to do CRUD operations on projects
 *
 * @param $http - The $http angular service
 * @param Project - Project factory
 * @returns {{getAll: getAll, get: get, create: create, update: update, delete: remove}}
 * @constructor
 */
// @ngInject
function ProjectResource($http, Project) {
    return {
        getAll: getAll,
        get: get,
        create: create,
        update: update,
        delete: remove
    };

    /**
     * Make a GET http request to /rest/projects in order to fetch all existing projects
     *
     * @returns {*}
     */
    function getAll() {
        return $http.get('/rest/projects')
            .then(response => response.data.map(p => new Project(p)));
    }

    /**
     * Make a GET http request to /rest/projects/{id} in order to fetch a single project by its id
     *
     * @param {number} id - The id of the project that should be fetched
     * @return {*}
     */
    function get(id) {
        return $http.get('/rest/projects/' + id)
            .then(response => new Project(response.data));
    }

    /**
     * Make a POST http request to /rest/projects with a project object as data in order to create a new project
     *
     * @param {ProjectFormModel} project - The project that should be created
     * @return {*}
     */
    function create(project) {
        return $http.post('/rest/projects', project)
            .then(response => new Project(response.data));
    }

    /**
     * Make a PUT http request to /rest/projects with a project as data in order to update an existing project
     *
     * @param {Project} project - The updated instance of a project that should be updated on the server
     * @return {*}
     */
    function update(project) {
        return $http.put('/rest/projects/' + project.id, project)
            .then(response => new Project(response.data));
    }

    /**
     * Make a DELETE http request to /rest/projects in order to delete an existing project
     *
     * @param {Project} project - The project that should be deleted
     * @returns {HttpPromise}
     */
    function remove(project) {
        return $http.delete('/rest/projects/' + project.id)
    }
}

export default ProjectResource;