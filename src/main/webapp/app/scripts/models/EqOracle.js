(function () {

    angular
        .module('weblearner.models')
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
         * @param minLength - The minimum length of a word that should be created
         * @param maxLength - The maximum length of a word that should be created
         * @param maxNoOfTests - The maximum number of words that are generated
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
         * @param minDepth - The minimum depth
         * @param maxDepth - The maximum depth
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
         * @constructor
         */
        function Sample(counterExamples) {
            this.type = eqOracles.SAMPLE;
            this.counterExamples = counterExamples || [];
        }

        /**
         * Creates an instance of an eqOracle from data
         *
         * @param data
         * @returns {*}
         */
        function build(data) {
            var eqOracle;

            switch (data.type) {
                case eqOracles.RANDOM:
                    eqOracle = new Random(data.minLength, data.maxLength, data.maxNoOfTests);
                    break;
                case eqOracles.COMPLETE:
                    eqOracle = new Complete(data.minDepth, data.maxDepth);
                    break;
                case eqOracles.SAMPLE:
                    eqOracle = new Sample(data.counterExamples);
                    break;
                default :
                    break;
            }

            return eqOracle;
        }

        /**
         * Creates a new instance of an EqOracle given a specific type
         *
         * @param type
         * @returns {*}
         */
        function createFromType(type) {
            return build({
                type: type
            })
        }
    }
}());