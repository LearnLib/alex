(function () {

    angular
        .module('ALEX.core')
        .factory('EqOracle', EqOracleModel);

    EqOracleModel.$inject = ['eqOracles'];

    /**
     * The factory that holds the models for an eq oracle
     *
     * @param eqOracles - The constants for eq oracle types
     * @returns {{Random: Random, Complete: Complete, Sample: Sample, build: build, createFromType: createFromType}}
     * @constructor
     */
    function EqOracleModel(eqOracles) {
        return {
            Random: Random,
            Complete: Complete,
            Sample: Sample,
            build: build,
            createFromType: createFromType
        };

        /**
         * The model for an eq oracle that searches randomly for counter examples
         *
         * @param {number} minLength - The minimum length of a word that should be created
         * @param {number} maxLength - The maximum length of a word that should be created
         * @param {number} maxNoOfTests - The maximum number of words that are generated
         * @constructor
         */
        function Random(minLength, maxLength, maxNoOfTests) {
            this.type = eqOracles.RANDOM;
            this.minLength = minLength || 1;
            this.maxLength = maxLength || 1;
            this.maxNoOfTests = maxNoOfTests || 1;
        }

        /**
         * The model for an eq oracle that searches in the hypothesis for counter examples starting from the start
         * state
         *
         * @param {number} minDepth - The minimum depth
         * @param {number} maxDepth - The maximum depth
         * @constructor
         */
        function Complete(minDepth, maxDepth) {
            this.type = eqOracles.COMPLETE;
            this.minDepth = minDepth || 1;
            this.maxDepth = maxDepth || 1;
        }

        /**
         * The model for an eq oracle where counter examples are chosen manually
         *
         * @param {Object[]} counterExamples
         * @constructor
         */
        function Sample(counterExamples) {
            this.type = eqOracles.SAMPLE;
            this.counterExamples = counterExamples || [];
        }

        /**
         * Creates an instance of an eqOracle from data
         *
         * @param {Object} data
         * @returns {*}
         */
        function build(data) {
            switch (data.type) {
                case eqOracles.RANDOM:
                    return new Random(data.minLength, data.maxLength, data.maxNoOfTests);
                case eqOracles.COMPLETE:
                    return new Complete(data.minDepth, data.maxDepth);
                case eqOracles.SAMPLE:
                    return new Sample(data.counterExamples);
                default :
                    return null;
            }
        }

        /**
         * Creates a new instance of an EqOracle given a specific type
         *
         * @param {string} type
         * @returns {*}
         */
        function createFromType(type) {
            return build({
                type: type
            })
        }
    }
}());