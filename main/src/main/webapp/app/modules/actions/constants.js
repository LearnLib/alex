(function () {
    'use strict';

    angular
        .module('ALEX.actions')

        // init dictionaries
        .constant('actionGroupTypes', {
            WEB: 'web',
            REST: 'rest',
            GENERAL: 'general'
        })

        // get the type of an action by actionTypes[actionGroupTypes.WEB|REST|GENERAL]
        .constant('actionTypes', {
            web: {
                CLICK: 'web_click',
                CLICK_LINK_BY_TEXT: 'web_clickLinkByText',
                CLEAR: 'web_clear',
                FILL: 'web_fill',
                CHECK_FOR_TEXT: 'web_checkForText',
                CHECK_FOR_NODE: 'web_checkForNode',
                CHECK_PAGE_TITLE: 'web_checkPageTitle',
                SUBMIT: 'web_submit',
                GO_TO: 'web_goto',
                SELECT: 'web_select'
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
            general: {
                ASSERT_COUNTER: 'assertCounter',
                ASSERT_VARIABLE: 'assertVariable',
                EXECUTE_SYMBOL: 'executeSymbol',
                INCREMENT_COUNTER: 'incrementCounter',
                SET_COUNTER: 'setCounter',
                SET_VARIABLE: 'setVariable',
                SET_VARIABLE_BY_COOKIE: 'setVariableByCookie',
                SET_VARIABLE_BY_JSON_ATTRIBUTE: 'setVariableByJSON',
                SET_VARIABLE_BY_NODE: 'setVariableByHTML',
                WAIT: 'wait'
            }
        });
}());