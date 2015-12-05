import {learnAlgorithm, eqOracleType, webBrowser} from '../constants';

/**
 * The filter to format a EQ type constant to something more readable
 * @returns {Function}
 */
function formatEqOracle() {
    return type => {
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
    };
}


/**
 * Formats the web browser dictionary
 * @returns {Function}
 */
function formatWebBrowser() {
    return browser => {
        switch (browser) {
            case webBrowser.HTMLUNITDRIVER:
                return 'HTML Unit Driver';
            case webBrowser.FIREFOX:
                return 'Firefox';
            case webBrowser.CHROME:
                return 'Chrome';
            case webBrowser.IE:
                return 'Internet Explorer';
            default:
                return browser;
        }
    };
}


/**
 * The filter to format a learn algorithm name to something more readable
 * @returns {Function}
 */
function formatAlgorithm() {
    return name => {
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
    };
}

/**
 * The filter takes a number representing milliseconds and formats it to [h] [min] s
 * @returns {Function}
 */
function formatMilliseconds() {
    return ms => {
        let hours, minutes, seconds;

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
    };
}

export {formatAlgorithm, formatEqOracle, formatMilliseconds, formatWebBrowser};