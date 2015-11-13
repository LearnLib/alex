import Counter from '../entities/Counter';

/**
 * The service that communicates with the API in order to read and delete counters.
 */
// @ngInject
class CounterResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Fetches all counters from the server
     *
     * @param {number} projectId - The id of a project
     * @returns angular promise object of the request
     */
    getAll(projectId) {
        return this.$http.get(`/rest/projects/${projectId}/counters`)
            .then(response => response.data.map(c => new Counter(c)));
    }

    /**
     * Deletes a single file from the server
     *
     * @param {number} projectId - The id of a project
     * @param {Counter} counter - The counter to delete
     * @returns angular promise object of the request
     */
    remove(projectId, counter) {
        return this.$http.delete(`/rest/projects/${projectId}/counters/${counter.name}`)
    }

    /**
     * Deletes multiple files from the server.
     *
     * @param {number} projectId - The id of a project
     * @param {Counter[]} counters - A list of counters to delete
     * @returns angular promise object of the request
     */
    removeMany(projectId, counters) {
        const names = counters.map(c => c.name).join(',');
        return this.$http.delete(`/rest/projects/${projectId}/counters/batch/${names}`);
    }
}

export default CounterResource;