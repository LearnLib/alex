import {eqOracleType} from '../constants';

class RandomEqOracle {
    constructor(minLength = 0, maxLength = 0, maxNoOfTests = 0) {
        this.type = eqOracleType.RANDOM;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.maxNoOfTests = maxNoOfTests;
    }

    isValid() {
        return this.minLength > 0
            && this.maxLength > 0
            && this.maxNoOfTests > 0
            && this.maxLength >= this.minLength;
    }
}

class CompleteEqOracle {
    constructor(minDepth = 0, maxDepth = 0) {
        this.type = eqOracleType.COMPLETE;
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
    }

    isValid() {
        return this.minDepth >= 0
            && this.maxDepth > 0
            && this.minDepth <= this.maxDepth;
    }
}

class SampleEqOracle {
    constructor(counterExamples = []) {
        this.type = eqOracleType.SAMPLE;
        this.counterExamples = counterExamples;
    }
}

class WMethodEqOracle {
    constructor(maxDepth = 1) {
        this.type = eqOracleType.WMETHOD;
        this.maxDepth = maxDepth;
    }

    isValid() {
        return this.maxDepth > 0;
    }
}

export {RandomEqOracle, CompleteEqOracle, WMethodEqOracle, SampleEqOracle};