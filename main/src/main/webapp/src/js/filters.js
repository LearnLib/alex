/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {learnAlgorithm, eqOracleType, userRole, webBrowser} from './constants';

/**
 * The filter to format a EQ type constant to something more readable
 * @returns {Function}
 */
export function formatEqOracle() {
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
 * The filter to format a user role
 * @returns {Function}
 */
export function formatUserRole() {
    return role => {
        switch (role) {
            case userRole.ADMIN:
                return 'Administrator';
            case userRole.REGISTERED:
                return 'Registered';
            default:
                return role;
        }
    };
}


/**
 * Formats the web browser dictionary
 * @returns {Function}
 */
export function formatWebBrowser() {
    return browser => {
        switch (browser) {
            case webBrowser.HTMLUNITDRIVER:
                return 'HTML Unit Driver';
            case webBrowser.CHROME:
                return 'Chrome';
            case webBrowser.FIREFOX:
                return 'Firefox';
            default:
                return browser;
        }
    };
}


/**
 * The filter to format a learn algorithm name to something more readable
 * @returns {Function}
 */
export function formatAlgorithm() {
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
export function formatMilliseconds() {
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