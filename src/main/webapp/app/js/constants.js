(function(){
    'use strict';

    angular
        .module('weblearner.constants')

        // api related stuff
        .constant('api', {
            URL: '/rest',
            PROXY_URL: '/rest/proxy?url='
        })

        // paths that are used in the application
    	.constant('paths', {
    		PARTIALS: 'app/partials',
    		PARTIALS_DIRECTIVES: 'app/partials/directives',
    		PARTIALS_MODALS: 'app/partials/modals',
    		PARTIALS_WIDGETS: 'app/partials/widgets'
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