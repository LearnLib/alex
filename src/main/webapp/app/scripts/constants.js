(function(){
    'use strict';

    angular
        .module('weblearner.constants')

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
    			WIDGETS: 'app/views/widgets',
                PAGES: 'app/views/pages'
    		},
    		api: {
    			URL: '/rest',
    			PROXY_URL: '/rest/proxy?url='
    		}
    	})

        // web action types
        .constant('actionTypes', {
            web: {
                SEARCH_FOR_TEXT: 'web_checkForText',
                SEARCH_FOR_NODE: 'web_checkForNode',
                CLEAR: 'web_clear',
                CLICK: 'web_click',
                FILL: 'web_fill',
                GO_TO: 'web_goto',
                SUBMIT: 'web_submit'
            },
            rest: {
                CALL_URL: 'rest_call',
                CHECK_STATUS: 'rest_checkStatus',
                CHECK_HEADER_FIELD: 'rest_checkHeaderField',
                CHECK_HTTP_BODY_TEXT: 'rest_checkForText',
                CHECK_ATTRIBUTE_EXISTS: 'rest_checkAttributeExists',
                CHECK_ATTRIBUTE_VALUE: 'rest_checkAttributeValue',
                CHECK_ATTRIBUTE_TYPE: 'rest_checkAttributeType'
            },
            other: {
                WAIT: 'wait',
                DECLARE_COUNTER: 'declareCounter',
                DECLARE_VARIABLE: 'declareVariable',
                INCREMENT_COUNTER: 'incrementCounter',
                SET_COUNTER: 'setCounter',
                SET_VARIABLE: 'setVariable',
                SET_VARIABLE_BY_JSON_ATTRIBUTE: 'setVariableByJSON',
                SET_VARIABLE_BY_NODE: 'setVariableByHTML'
            }
        })

        // eq oracles
        .constant('eqOracles', {
            RANDOM: 'random_word',
            COMPLETE: 'complete',
            SAMPLE: 'sample'
        })

        // learn algorithms
        .constant('learnAlgorithms', {
            EXTENSIBLE_LSTAR: 'EXTENSIBLE_LSTAR',
            DHC: 'DHC',
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE',
            TTT : 'TTT'
        })
}());