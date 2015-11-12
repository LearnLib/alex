/**
 * The service for interacting with the learner
 *
 * @param $http - The angular $http service
 * @param LearnResult - The LearnResult factory
 * @returns {{start: start, stop: stop, resume: resume, getStatus: getStatus, isActive: isActive, isCounterexample: isCounterexample}}
 * @constructor
 */
// @ngInject
function LearnerResource($http, LearnResult) {
    return {
        start: start,
        stop: stop,
        resume: resume,
        getStatus: getStatus,
        isActive: isActive,
        isCounterexample: isCounterexample
    };

    /**
     * Start the server side learning process of a project
     *
     * @param {number} projectId
     * @param {LearnConfiguration} learnConfiguration
     * @return {*}
     */
    function start(projectId, learnConfiguration) {
        return $http.post('/rest/learner/start/' + projectId, learnConfiguration);
    }

    /**
     * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
     * with the thread handling
     *
     * @return {*}
     */
    function stop() {
        return $http.get('/rest/learner/stop');
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
    function resume(projectId, testNo, learnConfiguration) {
        return $http.post('/rest/learner/resume/' + projectId + '/' + testNo, learnConfiguration);
    }

    /**
     * Gets the learner result that includes the hypothesis. make sure isActive() returns true before calling this
     * function
     *
     * @return {*}
     */
    function getStatus() {
        return $http.get('/rest/learner/status')
            .then(function (response) {
                return LearnResult.transformApiResponse(response);
            })
            .catch(function () {
                return null;
            })
    }

    /**
     * Check if the server is finished learning a project
     *
     * @return {*}
     */
    function isActive() {
        return $http.get('/rest/learner/active')
            .then(function (response) {
                return response.data;
            })
    }

    /**
     * Verifies a possible counterexample
     *
     * @param {number} projectId
     * @param {{id: number, revision: number}} resetSymbol - The id/revision pair of the reset symbol
     * @param {{id: number, revision: number}[]} symbols - The list of id/revision pairs of symbols
     * @returns {*}
     */
    function isCounterexample(projectId, resetSymbol, symbols) {
        return $http.post('/rest/learner/outputs/' + projectId, {
            resetSymbol: resetSymbol,
            symbols: symbols
        }).then(function (response) {
            return response.data;
        })
    }
}

export default LearnerResource;