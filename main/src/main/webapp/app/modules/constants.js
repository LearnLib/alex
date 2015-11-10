(function () {
    'use strict';

    angular
        .module('ALEX')

        // learn algorithms
        .constant('learnAlgorithms', {
            LSTAR: 'LSTAR',
            DHC: 'DHC',
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE',
            TTT: 'TTT'
        })

        // available selenium web drivers
        .constant('webBrowser', {
            FIREFOX: 'FIREFOX',
            CHROME: 'CHROME',
            IE: 'IE',
            HTMLUNITDRIVER: 'HTMLUNITDRIVER'
        })

        .constant('eqOracleType', {
            RANDOM: 'random_word',
            COMPLETE: 'complete',
            SAMPLE: 'sample',
            WMETHOD: 'wmethod'
        })

        .constant('events', {
            // project related events
            PROJECT_CREATED: 'project:created',
            PROJECT_UPDATED: 'project:updated',
            PROJECT_DELETED: 'project:deleted',
            PROJECT_OPENED: 'project:opened',

            // symbol group related events
            GROUP_CREATED: 'group:created',
            GROUP_UPDATED: 'group:updated',
            GROUP_DELETED: 'group:deleted',

            // hypothesis related events
            HYPOTHESIS_LABEL_SELECTED: 'hypothesis:labelSelected',

            // user related events
            USER_UPDATED: 'user:updated',
            USER_DELETED: 'user:deleted',
            USER_LOGGED_IN: 'user:loggedIn'
        })
}());