(function () {
    'use strict';

    angular
        .module('ALEX')

        // paths that are used in the application
        .constant('paths', {
            api: {
                URL: '/rest',
                PROXY_URL: '/rest/proxy?url='
            }
        })

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
            GROUP_CREATED: 'group:created',
            GROUP_UPDATED: 'group:updated',
            GROUP_DELETED: 'group:deleted'
        })
}());