import {RandomEqOracle, CompleteEqOracle, WMethodEqOracle, SampleEqOracle} from '../../../src/js/entities/EqOracle';
import {eqOracleType} from '../../../src/js/constants';

describe('EqOracle', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a random eq oracle', () => {

        // with default parameters
        let oracle = new RandomEqOracle();
        let expectedOracle = {
            type: eqOracleType.RANDOM,
            minLength: 0,
            maxLength: 0,
            maxNoOfTests: 0
        };

        expect(angular.toJson(oracle)).toEqual(angular.toJson(expectedOracle));

        oracle = new RandomEqOracle(5,10,20);
        expectedOracle = {
            type: eqOracleType.RANDOM,
            minLength: 5,
            maxLength: 10,
            maxNoOfTests: 20,
            seed: 42
        };

        expect(angular.toJson(oracle)).toEqual(angular.toJson(expectedOracle));
    });

    it('should correctly create a complete eq oracle', () => {

        // with default parameters
        let oracle = new CompleteEqOracle();
        let expectedOracle = {
            type: eqOracleType.COMPLETE,
            minDepth: 0,
            maxDepth: 0
        };

        expect(angular.toJson(oracle)).toEqual(angular.toJson(expectedOracle));

        oracle = new CompleteEqOracle(5,10);
        expectedOracle = {
            type: eqOracleType.COMPLETE,
            minDepth: 5,
            maxDepth: 10
        };

        expect(angular.toJson(oracle)).toEqual(angular.toJson(expectedOracle));
    });

    it('should correctly create a sample eq oracle', () => {

        // with default parameters
        let oracle = new SampleEqOracle();
        let expectedOracle = {
            type: eqOracleType.SAMPLE,
            counterExamples: []
        };

        expect(angular.toJson(oracle)).toEqual(angular.toJson(expectedOracle));

        oracle = new SampleEqOracle([{input: 's1', output: 'OK'}, {input: 's2', output: 'FAILED'}]);
        expectedOracle = {
            type: eqOracleType.SAMPLE,
            counterExamples: [{input: 's1', output: 'OK'}, {input: 's2', output: 'FAILED'}]
        };

        expect(angular.toJson(oracle)).toEqual(angular.toJson(expectedOracle));
    });

    it('should correctly create a w method eq oracle', () => {

        // with default parameters
        let oracle = new WMethodEqOracle();
        let expectedOracle = {
            type: eqOracleType.WMETHOD,
            maxDepth: 1
        };

        expect(angular.toJson(oracle)).toEqual(angular.toJson(expectedOracle));

        oracle = new WMethodEqOracle(5);
        expectedOracle = {
            type: eqOracleType.WMETHOD,
            maxDepth: 5
        };

        expect(angular.toJson(oracle)).toEqual(angular.toJson(expectedOracle));
    });
});