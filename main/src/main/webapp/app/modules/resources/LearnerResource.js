import LearnResult from '../entities/LearnResult';

/**
 * The service for interacting with the learner
 */
// @ngInject
class LearnerResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Start the server side learning process of a project
     *
     * @param {number} projectId
     * @param {LearnConfiguration} learnConfiguration
     * @return {*}
     */
    start(projectId, learnConfiguration) {
        return this.$http.post(`/rest/learner/start/${projectId}`, learnConfiguration);
    }

    /**
     * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
     * with the thread handling
     *
     * @return {*}
     */
    stop() {
        return this.$http.get('/rest/learner/stop');
    }

    /**
     * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
     * so that the ongoing process parameters could be defined
     *
     * @param {number} projectId
     * @param {number} testNo
     * @param {LearnConfiguration} learnConfiguration
     * @return {*}
     */
    resume(projectId, testNo, learnConfiguration) {
        return this.$http.post(`/rest/learner/resume/${projectId}/${testNo}`, learnConfiguration);
    }

    /**
     * Gets the learner result that includes the hypothesis. make sure isActive() returns true before calling this
     * function
     *
     * @return {*}
     */
    getStatus() {
        return this.$http.get('/rest/learner/status')
            .then(response => new LearnResult(response.data))
            .catch(() => null);
    }

    /**
     * Check if the server is finished learning a project
     *
     * @return {*}
     */
    isActive() {
        return this.$http.get('/rest/learner/active')
            .then(response => response.data)
    }

    /**
     * Verifies a possible counterexample
     *
     * @param {number} projectId
     * @param {{id: number, revision: number}} resetSymbol - The id/revision pair of the reset symbol
     * @param {{id: number, revision: number}[]} symbols - The list of id/revision pairs of symbols
     * @returns {*}
     */
    isCounterexample(projectId, resetSymbol, symbols) {
        return this.$http.post(`/rest/learner/outputs/${projectId}`, {
            resetSymbol: resetSymbol,
            symbols: symbols
        }).then(response => response.data)
    }
}

export default LearnerResource;