import {eqOracleType} from '../constants';

/** The model for the random eq oracle */
class RandomEqOracle {

    /**
     * Constructor
     * @param {number} minLength
     * @param {number} maxLength
     * @param {number} maxNoOfTests
     */
    constructor(minLength = 0, maxLength = 0, maxNoOfTests = 0) {
        this.type = eqOracleType.RANDOM;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.maxNoOfTests = maxNoOfTests;
    }
}

/** The model for the complete eq oracle */
class CompleteEqOracle {

    /**
     * Constructor
     * @param {number} minDepth
     * @param {number} maxDepth
     */
    constructor(minDepth = 0, maxDepth = 0) {
        this.type = eqOracleType.COMPLETE;
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
    }
}

/** The model for the sample eq oracle */
class SampleEqOracle {

    /**
     * Constructor
     * @param {Array} counterExamples
     */
    constructor(counterExamples = []) {
        this.type = eqOracleType.SAMPLE;
        this.counterExamples = counterExamples;
    }
}

/** The model the the wmethod eq oracle */
class WMethodEqOracle {

    /**
     * Constructor
     * @param {number} maxDepth
     */
    constructor(maxDepth = 1) {
        this.type = eqOracleType.WMETHOD;
        this.maxDepth = maxDepth;
    }
}

export {RandomEqOracle, CompleteEqOracle, WMethodEqOracle, SampleEqOracle};