import {eqOracleType} from '../constants';
import {RandomEqOracle, CompleteEqOracle, SampleEqOracle, WMethodEqOracle} from '../entities/EqOracle';

/** The service to create new eq oracles */
class EqOracleService {

    /**
     * Creates an eqOracle from a given type
     * @param obj
     * @returns {*}
     */
    create(obj) {
        switch (obj.type) {
            case eqOracleType.RANDOM:
                return new RandomEqOracle(obj.minLength, obj.maxLength, obj.maxNoOfTests);
            case eqOracleType.COMPLETE:
                return new CompleteEqOracle(obj.minDepth, obj.maxDepth);
            case eqOracleType.SAMPLE:
                return new SampleEqOracle(obj.counterExamples);
            case eqOracleType.WMETHOD:
                return new WMethodEqOracle(obj.maxDepth);
            default:
                return null;
        }
    }

    /**
     * The type of the eqOracle to create
     * @param {string} type
     * @returns {*}
     */
    createFromType(type) {
        return this.create({type: type});
    }
}

export default EqOracleService;