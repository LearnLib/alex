(function () {
    'use strict';

    // init dictionaries
    var actionGroupTypes = {
        WEB: 0,
        REST: 1,
        GENERAL: 2
    };

    // get the type of an action by actionTypes[actionGroupTypes.WEB|REST|GENERAL]
    var actionTypes = {
        0: {
            CLICK: 'web_click',
            CLICK_LINK_BY_TEXT: 'web_clickLinkByText',
            CLEAR: 'web_clear',
            FILL: 'web_fill',
            CHECK_FOR_TEXT: 'web_checkForText',
            CHECK_FOR_NODE: 'web_checkForNode',
            SUBMIT: 'web_submit',
            GO_TO: 'web_goto',
            SELECT: 'web_select'
        },
        1: {
            CALL_URL: 'rest_call',
            CHECK_STATUS: 'rest_checkStatus',
            CHECK_HEADER_FIELD: 'rest_checkHeaderField',
            CHECK_HTTP_BODY_TEXT: 'rest_checkForText',
            CHECK_ATTRIBUTE_EXISTS: 'rest_checkAttributeExists',
            CHECK_ATTRIBUTE_VALUE: 'rest_checkAttributeValue',
            CHECK_ATTRIBUTE_TYPE: 'rest_checkAttributeType'
        },
        2: {
            EXECUTE_SYMBOL: 'executeSymbol',
            INCREMENT_COUNTER: 'incrementCounter',
            SET_COUNTER: 'setCounter',
            SET_VARIABLE: 'setVariable',
            SET_VARIABLE_BY_COOKIE: 'setVariableByCookie',
            SET_VARIABLE_BY_JSON_ATTRIBUTE: 'setVariableByJSON',
            SET_VARIABLE_BY_NODE: 'setVariableByHTML',
            WAIT: 'wait'
        }
    };

    // assign them to constants
    angular
        .module('ALEX.actions')
        .constant('actionGroupTypes', actionGroupTypes)
        .constant('actionTypes', actionTypes);
}());