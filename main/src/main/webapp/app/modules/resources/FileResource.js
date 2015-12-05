/**
 * The resource that handles API calls concerning the management of files.
 */
// @ngInject
class FileResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Fetches all available files from the server that belong to a project
     *
     * @param {number} projectId - The id of the project
     */
    getAll(projectId) {
        return this.$http.get(`/rest/projects/${projectId}/files`)
            .then(response => response.data);
    }

    /**
     * Deletes a single file from the server
     *
     * @param {number} projectId - The id of the project
     * @param {File} file - The file object to be deleted
     */
    remove(projectId, file) {
        const encodedFileName = encodeURI(file.name);
        return this.$http.delete(`/rest/projects/${projectId}/files/${encodedFileName}`);
    }
}

export default FileResource;