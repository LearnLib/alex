(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .filter('formatEnumKey', formatEnumKey)
        .filter('formatEqOracle', formatEqOracle)
        .filter('formatAlgorithm', formatAlgorithm);

    formatEqOracle.$inject = ['EqOracle'];
    formatAlgorithm.$inject = ['learnAlgorithms'];

    /**
     * The filter that formats something like 'A_CONSTANT_KEY' to 'A Constant Key'
     *
     * @returns {filter}
     */
    function formatEnumKey() {
        return filter;

        /**
         * @param {string} string - The enum key in upper snake case format
         * @returns {string}
         */
        function filter(string) {
            return string.toLowerCase().split('_').join(' ').replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        }
    }


    /**
     * The filter to format a EQ type constant to something more readable
     *
     * @param {Object} EqOracle - The eq oracle model
     * @returns {filter}
     */
    function formatEqOracle(EqOracle) {
        return filter;

        /**
         * @param {string} type - The eq oracle type
         * @returns {string}
         */
        function filter(type) {
            switch (type) {
                case EqOracle.types.RANDOM:
                    return 'Random Word';
                case  EqOracle.types.COMPLETE:
                    return 'Complete';
                case  EqOracle.types.SAMPLE:
                    return 'Sample';
                default:
                    return type;
            }
        }
    }

    /**
     * The filter to format a learn algorithm name to something more readable

     * @param {Object} learnAlgorithms - The dictionary of learn algorithms
     * @returns {filter}
     */
    function formatAlgorithm(learnAlgorithms) {
        return filter;

        /**
         * @param {string} name - the name of a learn algorithm
         * @returns {string}
         */
        function filter(name) {
            switch (name) {
                case learnAlgorithms.LSTAR:
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