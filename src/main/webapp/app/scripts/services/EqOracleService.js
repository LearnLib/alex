(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('EqOracleService', [
            'EqOraclesEnum',
            EqOracleService
        ]);

    function EqOracleService(EqOraclesEnum) {

        var _eqOracleComplete = {
            type: EqOraclesEnum.COMPLETE,
            minDepth: 1,
            maxDepth: 1
        };

        var _eqOracleRandom = {
            type: EqOraclesEnum.RANDOM,
            minLength: 1,
            maxLength: 1,
            maxNoOfTests: 1
        };

        var _eqOracleSample = {
            type: EqOraclesEnum.SAMPLE,
            counterExamples: []
        };

        //////////

        var service = {
            create: create
        };
        return service;

        //////////

        function create(eqOracleType) {
            switch (eqOracleType) {
                case EqOraclesEnum.COMPLETE:
                    return angular.copy(_eqOracleComplete);
                    break;
                case EqOraclesEnum.RANDOM:
                    return angular.copy(_eqOracleRandom);
                    break;
                case EqOraclesEnum.SAMPLE:
                    return angular.copy(_eqOracleSample);
                    break;
                default:
                    return angular.copy(_eqOracleRandom);
                    break;
            }
        }
    }
}());