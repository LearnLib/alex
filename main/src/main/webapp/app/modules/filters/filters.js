import {learnAlgorithm, eqOracleType} from '../constants';

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
        return string.toLowerCase().split('_').join(' ').replace(/\w\S*/g, txt => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
    }
}


/**
 * The filter to format a EQ type constant to something more readable
 *
 * @returns {filter}
 */
// @ngInject
function formatEqOracle() {
    return filter;

    /**
     * @param {string} type - The eq oracle type
     * @returns {string}
     */
    function filter(type) {
        switch (type) {
            case eqOracleType.RANDOM:
                return 'Random Word';
            case  eqOracleType.COMPLETE:
                return 'Complete';
            case  eqOracleType.SAMPLE:
                return 'Sample';
            case  eqOracleType.WMETHOD:
                return 'W-Method';
            default:
                return type;
        }
    }
}

/**
 * The filter to format a learn algorithm name to something more readable
 * @returns {filter}
 */
// @ngInject
function formatAlgorithm() {
    return filter;

    /**
     * @param {string} name - the name of a learn algorithm
     * @returns {string}
     */
    function filter(name) {
        switch (name) {
            case learnAlgorithm.LSTAR:
                return 'L*';
            case learnAlgorithm.DHC:
                return 'DHC';
            case learnAlgorithm.TTT:
                return 'TTT';
            case learnAlgorithm.DISCRIMINATION_TREE:
                return 'Discrimination Tree';
            default:
                return name;
        }
    }
}

/**
 * The filter takes a number representing milliseconds and formats it to [h] [min] s
 * @returns {filter}
 */
function formatMilliseconds() {
    return filter;

    /**
     * @param ms - The number in ms to format
     * @returns {string}
     */
    function filter(ms) {
        var hours, minutes, seconds;

        if (ms >= 3600000) {
            hours = Math.floor(ms / 3600000);
            ms = ms % 3600000;
            minutes = Math.floor(ms / 60000);
            seconds = Math.floor((ms % 60000) / 1000);
            return hours + 'h ' + minutes + 'min ' + seconds + 's';
        } else if (ms >= 60000) {
            minutes = Math.floor(ms / 60000);
            return minutes + 'min ' + Math.floor((ms % 60000) / 1000) + 's';
        } else {
            return Math.floor(ms / 1000) + 's';
        }
    }
}

export {formatAlgorithm, formatEnumKey, formatEqOracle, formatMilliseconds};