import LearnResult from '../entities/LearnResult';

/**
 * The resource that handles http request to the API to do CRUD operations on learn results
 */
// @ngInject
class LearnResultResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Gets all final steps of all learn results
     *
     * @param {number} projectId - The id of the project whose final learn results should be fetched
     * @returns {*}
     */
    getAllFinal(projectId) {
        return this.$http.get(`/rest/projects/${projectId}/results`)
            .then(response => response.data.map(r => new LearnResult(r)));
    }

    /**
     * Gets the final learn result of a test run
     *
     * @param {number} projectId - The id of the project
     * @param {number} testNo - The number of the test run
     * @returns {*}
     */
    getFinal(projectId, testNo) {
        return this.$http.get(`/rest/projects/${projectId}/results/${testNo}`)
            .then(response => new LearnResult(response.data));
    }

    /**
     * Get all steps of a test run
     *
     * @param {number} projectId - The id of the project of the test
     * @param {number} testNo - The number of the test that should be completely fetched
     * @returns {*}
     */
    getComplete(projectId, testNo) {
        return this.$http.get(`/rest/projects/${projectId}/results/${testNo}/complete`)
            .then(response => {
                response.data.shift();
                return response.data.map(r => new LearnResult(r));
            })
    }

    /**
     * Gets all steps of multiple test runs
     *
     * @param {number} projectId - The id of the project
     * @param {number[]} testNos - The list of test numbers to get all steps from
     * @returns {*} [LearnResult[]]
     */
    getManyComplete(projectId, testNos) {
        return this.$http.get(`/rest/projects/${projectId}/results/${testNos}/complete`)
            .then(response => {
                if (response.data.length > 0) {
                    if (!angular.isArray(response.data[0])) {
                        response.data.shift();
                        return [response.data.map(r => new LearnResult(r))]
                    } else {
                        response.data.forEach(data => {
                            data.shift(); // remove cumulated results from the beginning
                        });
                        return response.data.map(r => new LearnResult(r));
                    }
                } else {
                    return [[]];
                }
            })
    }

    /**
     * Deletes a list of learn results
     *
     * @param {LearnResult|LearnResult[]} results
     */
    remove(results) {
        let testNos, projectId;
        if (angular.isArray(results)) {
            testNos = results.map(r => r.testNo).join(',');
            projectId = results[0].project;
        } else {
            testNos = results.testNo;
            projectId = results.project;
        }
        return this.$http.delete(`/rest/projects/${projectId}/results/${testNos}`, {})
    }
}

export default LearnResultResource;