/**
 * Contains models for eq oracles
 *
 * @returns {{}}
 * @constructor
 */
function EqOracleModel() {

    var EqOracle = {};

    /**
     * The dictionary of eq oracle types
     *
     * @type {{RANDOM: string, COMPLETE: string, SAMPLE: string}}
     */
    EqOracle.types = {
        RANDOM: 'random_word',
        COMPLETE: 'complete',
        SAMPLE: 'sample',
        WMETHOD: 'wmethod'
    };

    /**
     * The model for an eq oracle that searches randomly for counter examples
     *
     * @param {number} minLength - The minimum length of a word that should be created
     * @param {number} maxLength - The maximum length of a word that should be created
     * @param {number} maxNoOfTests - The maximum number of words that are generated
     * @constructor
     */
    EqOracle.Random = function (minLength, maxLength, maxNoOfTests) {
        this.type = EqOracle.types.RANDOM;
        this.minLength = angular.isDefined(minLength) && minLength > 0 ? minLength : 1;
        this.maxLength = angular.isDefined(maxLength) && maxLength > 0 ? maxLength : 1;
        this.maxNoOfTests = angular.isDefined(maxNoOfTests) && maxNoOfTests > 0 ? maxNoOfTests : 1;
    };

    /**
     * The model to the complete eq oracle
     *
     * @param {number} minDepth - The minimum depth
     * @param {number} maxDepth - The maximum depth
     * @constructor
     */
    EqOracle.Complete = function (minDepth, maxDepth) {
        this.type = EqOracle.types.COMPLETE;
        this.minDepth = angular.isDefined(minDepth) && minDepth > 0 ? minDepth : 1;
        this.maxDepth = angular.isDefined(maxDepth) && maxDepth > 0 ? maxDepth : 1;
    };

    /**
     * The model of a sample eq oracle
     *
     * @param {{input: string, output: string}[]} counterExamples
     * @constructor
     */
    EqOracle.Sample = function (counterExamples) {
        this.type = EqOracle.types.SAMPLE;
        this.counterExamples = counterExamples || [];
    };

    /**
     * The model of a w method eq oracle
     *
     * @param {number} maxDepth - The maximum depth
     * @constructor
     */
    EqOracle.WMethod = function (maxDepth) {
        this.type = EqOracle.types.WMETHOD;
        this.maxDepth = angular.isDefined(maxDepth) && maxDepth > 0 ? maxDepth : 1;
    };

    /**
     * Creates an instances of an eq oracle from an object or an eq oracle type
     *
     * @param {Object|string} data - The object presenting an eq oracle or the string of an eq oracle type
     * @returns {*|null} - An instance of an eq oracle or null
     */
    EqOracle.build = function (data) {
        function create(data) {
            switch (data.type) {
                case EqOracle.types.RANDOM:
                    return new EqOracle.Random(data.minLength, data.maxLength, data.maxNoOfTests);
                case EqOracle.types.COMPLETE:
                    return new EqOracle.Complete(data.minDepth, data.maxDepth);
                case EqOracle.types.SAMPLE:
                    return new EqOracle.Sample(data.counterExamples);
                case EqOracle.types.WMETHOD:
                    return new EqOracle.WMethod(data.maxDepth);
                default :
                    return null;
            }
        }

        if (angular.isObject(data)) {
            return create(data);
        } else if (angular.isString(data)) {
            return create({type: data})
        } else {
            return null;
        }
    };

    return EqOracle;
}

export default EqOracleModel;