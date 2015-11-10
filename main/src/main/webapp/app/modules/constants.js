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

        .constant('events', {
            // project related events
            PROJECT_CREATED: 'project:created',
            PROJECT_UPDATED: 'project:updated',
            PROJECT_DELETED: 'project:deleted',

            // symbol group related events
            GROUP_CREATED: 'group:created',
            GROUP_UPDATED: 'group:updated',
            GROUP_DELETED: 'group:deleted'
        })
}());