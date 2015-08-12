(function () {
    'use strict';

    angular
        .module('ALEX.core')

        // make global libraries a constant for better testing
        .constant('_', window._)                // lodash
        .constant('dagreD3', window.dagreD3)    // dagreD3
        .constant('d3', window.d3)              // d3
        .constant('graphlib', window.graphlib)  // graphlib

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