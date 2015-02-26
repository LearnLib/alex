(function(){
    'use strict';

    angular
        .module('weblearner.constants')
        
        // make lodash a constant for better testing
        .constant('_', window._)

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
        .constant('WebActionTypes', {
            SEARCH_FOR_TEXT: 'checkText',
            SEARCH_FOR_NODE: 'checkNode',
            CLEAR: 'clear',
            CLICK: 'click',
            FILL: 'fill',
            GO_TO: 'goto',
            SUBMIT: 'submit',
            WAIT: 'wait'
        })

        // rest action types
        .constant('RestActionTypes', {
            CALL_URL: 'call',
            CHECK_STATUS: 'checkStatus',
            CHECK_HEADER_FIELD: 'checkHeaderField',
            CHECK_HTTP_BODY_TEXT: 'checkForText',
            CHECK_ATTRIBUTE_EXISTS: 'checkAttributeExists',
            CHECK_ATTRIBUTE_VALUE: 'checkAttributeValue',
            CHECK_ATTRIBUTE_TYPE: 'checkAttributeType'
        })

        // eq oracles
        .constant('EqOraclesEnum', {
            RANDOM: 'random_word',
            COMPLETE: 'complete',
            SAMPLE: 'sample'
        })

        // learn algorithms
        .constant('LearnAlgorithmsEnum', {
            EXTENSIBLE_LSTAR: 'EXTENSIBLE_LSTAR',
            DHC: 'DHC',
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE'
        })
}());