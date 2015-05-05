(function () {
    'use strict';

    angular
        .module('ALEX.constants')

        // make global libraries a constant for better testing
        .constant('_', window._)                // lodash
        .constant('dagreD3', window.dagreD3)    // dagreD3
        .constant('d3', window.d3)              // d3
        .constant('graphlib', window.graphlib)  // graphlib

        // paths that are used in the application
        .constant('paths', {
            views: {
                BASE: 'app/views',
                DIRECTIVES: 'app/views/directives',
                MODALS: 'app/views/modals',
                PAGES: 'app/views/pages',
                COMPONENTS: 'app/components'
            },
            api: {
                URL: '/rest',
                PROXY_URL: '/rest/proxy?url='
            }
        })

        //output alphabet
        .constant('outputAlphabet', {
            OK: 'OK',
            FAILED: 'FAILED'
        })

        // eq oracles
        .constant('eqOracles', {
            RANDOM: 'random_word',
            COMPLETE: 'complete',
            SAMPLE: 'sample'
        })

        // learn algorithms
        .constant('learnAlgorithms', {
            LSTAR: 'LSTAR',
            DHC: 'DHC',
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE',
            TTT: 'TTT'
        })
}());