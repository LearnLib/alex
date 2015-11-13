import LearnConfiguration from './LearnConfiguration';

/**
 * The model for a learner result
 */
class LearnResult {

    /**
     * Constructor
     * @param obj - The object to create a learn result from
     */
    constructor(obj) {

        /**
         * The learnConfiguration
         * @type {LearnConfiguration|*}
         */
        this.configuration = new LearnConfiguration(obj.configuration);

        /**
         * The hypothesis
         * @type {object}
         */
        this.hypothesis = obj.hypothesis;

        /**
         * The project id of the learn result
         * @type{number}
         */
        this.project = obj.project;

        /**
         * The alphabet the process has been learned with
         * @type {{id:number,revision:number}[]}
         */
        this.sigma = obj.sigma;

        /**
         * The n in n-th hypothesis
         * @type {number}
         */
        this.stepNo = obj.stepNo;

        /**
         * The test number
         * @type {number}
         */
        this.testNo = obj.testNo;

        /**
         * The internal data structure of the used algorithm.
         * Not available for DHC
         * @type {string}
         */
        this.algorithmInformation = obj.algorithmInformation;

        /**
         * The statistics of the process
         * @type {object}
         */
        this.statistics = obj.statistics;

        /**
         * If there has been an error
         * @type {boolean}
         */
        this.error = obj.error;

        /**
         * The error message why the process failed
         * @type {string}
         */
        this.errorText = obj.errorText;

        // convert ns to ms
        this.statistics.startTime = Math.ceil(this.statistics.startTime / 1000000);
        this.statistics.duration = Math.ceil(this.statistics.duration / 1000000);
    }

    /**
     * Indicates if an error has been recorded during the step
     * @returns {boolean}
     */
    hasError() {
        return angular.isDefined(this.error);
    }
}

export default LearnResult;