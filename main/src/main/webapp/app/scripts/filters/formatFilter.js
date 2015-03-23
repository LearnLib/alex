(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('formatEnumKey', formatEnumKey)
        .filter('formatEqOracle', formatEqOracle)
        .filter('formatAlgorithm', formatAlgorithm);

    formatEqOracle.$inject = ['eqOracles'];
    formatAlgorithm.$inject = ['learnAlgorithms'];

    function formatEnumKey() {
        return function (string) {
            return string.toLowerCase().split('_').join(' ').replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        }
    }

    function formatEqOracle(eqOracles) {
        return function (type) {
            switch (type) {
                case eqOracles.RANDOM:
                    return 'Random Word';
                case eqOracles.COMPLETE:
                    return 'Complete';
                case eqOracles.SAMPLE:
                    return 'Sample';
                default:
                    return type;
            }
        }
    }

    function formatAlgorithm(learnAlgorithms) {
        return function (name) {
            switch (name) {
                case learnAlgorithms.EXTENSIBLE_LSTAR:
                    return 'L*';
                case learnAlgorithms.DHC:
                    return 'DHC';
                case learnAlgorithms.TTT:
                    return 'TTT';
                case learnAlgorithms.DISCRIMINATION_TREE:
                    return 'Discrimination Tree';
                default:
                    return name;
            }
        }
    }

}());