(function () {
    'use strict';

    angular
        .module('ALEX.core')

        // paths that are used in the application
        .constant('paths', {
            api: {
                URL: '/rest',
                PROXY_URL: '/rest/proxy?url='
            },
            COMPONENTS: 'app/modules'
        })

        // learn algorithms
        .constant('learnAlgorithms', {
            LSTAR: 'LSTAR',
            DHC: 'DHC',
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE',
            TTT: 'TTT'
        })
}());