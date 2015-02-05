(function () {
    'use strict';

    // nice names for learnAlgorithms
    // nice names for web and rest actions

    angular
        .module('weblearner.filters')
        .filter('niceEqOracleName', [
            'EqOraclesEnum',
            niceEqOracleName
        ]);

    function niceEqOracleName(EqOraclesEnum) {
        return function (eqOracleType) {
            switch (eqOracleType) {
                case EqOraclesEnum.COMPLETE:
                    return 'Complete';
                    break;
                case EqOraclesEnum.RANDOM:
                    return 'Random';
                    break;
                case  EqOraclesEnum.SAMPLE:
                    return 'Manual';
                    break;
                default :
                    return '';
                    break;
            }
        }
    }

    angular
        .module('weblearner.filters')
        .filter('niceLearnAlgorithmName', [
            'LearnAlgorithmsEnum',
            niceLearnAlgorithmName
        ]);

    function niceLearnAlgorithmName(LearnAlgorithmsEnum) {
        return function (algorithm) {
            switch (algorithm) {
                case LearnAlgorithmsEnum.DHC:
                    return 'DHC';
                    break;
                case LearnAlgorithmsEnum.EXTENSIBLE_LSTAR:
                    return 'L*';
                    break;
                case LearnAlgorithmsEnum.DISCRIMINATION_TREE:
                    return 'Discrimination Tree';
                    break;
                default :
                    return '';
                    break;
            }
        }
    }

}());