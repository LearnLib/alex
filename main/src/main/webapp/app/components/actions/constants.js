(function(){
    'use strict';

    // init dictionaries
    var actionGroupTypes = {};
    var actionTypes = {};

    // declare actionGroup enum
    actionGroupTypes['WEB'] 	= 0;
    actionGroupTypes['REST'] 	= 1;
    actionGroupTypes['GENERAL'] = 2;

    // init dictionaries for action types based on action groups enum
    actionTypes[actionGroupTypes.WEB] 		= {};
    actionTypes[actionGroupTypes.REST] 		= {};
    actionTypes[actionGroupTypes.GENERAL] 	= {};

    // declare web action types
    actionTypes[actionGroupTypes.WEB]['CLICK'] 			    = 'web_click';
    actionTypes[actionGroupTypes.WEB]['CLICK_LINK_BY_TEXT'] = 'web_clickLinkByText';
    actionTypes[actionGroupTypes.WEB]['CLEAR'] 			    = 'web_clear';
    actionTypes[actionGroupTypes.WEB]['FILL'] 			    = 'web_fill';
    actionTypes[actionGroupTypes.WEB]['CHECK_FOR_TEXT']     = 'web_checkForText';
    actionTypes[actionGroupTypes.WEB]['CHECK_FOR_NODE']     = 'web_checkForNode';
    actionTypes[actionGroupTypes.WEB]['SUBMIT'] 		    = 'web_submit';
    actionTypes[actionGroupTypes.WEB]['GO_TO'] 			    = 'web_goto';
    actionTypes[actionGroupTypes.WEB]['SELECT']             = 'web_select';

    // declare REST action types
    actionTypes[actionGroupTypes.REST]['CALL_URL']                  = 'rest_call';
    actionTypes[actionGroupTypes.REST]['CHECK_STATUS']              = 'rest_checkStatus';
    actionTypes[actionGroupTypes.REST]['CHECK_HEADER_FIELD']        = 'rest_checkHeaderField';
    actionTypes[actionGroupTypes.REST]['CHECK_HTTP_BODY_TEXT']      = 'rest_checkForText';
    actionTypes[actionGroupTypes.REST]['CHECK_ATTRIBUTE_EXISTS']    = 'rest_checkAttributeExists';
    actionTypes[actionGroupTypes.REST]['CHECK_ATTRIBUTE_VALUE']     = 'rest_checkAttributeValue';
    actionTypes[actionGroupTypes.REST]['CHECK_ATTRIBUTE_TYPE']      = 'rest_checkAttributeType';

    // declare general action types
    actionTypes[actionGroupTypes.GENERAL]['EXECUTE_SYMBOL']                 = 'executeSymbol';
    actionTypes[actionGroupTypes.GENERAL]['INCREMENT_COUNTER']              = 'incrementCounter';
    actionTypes[actionGroupTypes.GENERAL]['SET_COUNTER']                    = 'setCounter';
    actionTypes[actionGroupTypes.GENERAL]['SET_VARIABLE']                   = 'setVariable';
    actionTypes[actionGroupTypes.GENERAL]['SET_VARIABLE_BY_JSON_ATTRIBUTE'] = 'setVariableByJSON';
    actionTypes[actionGroupTypes.GENERAL]['SET_VARIABLE_BY_NODE']           = 'setVariableByHTML';
    actionTypes[actionGroupTypes.GENERAL]['WAIT']                           = 'wait';

    // assign them to constants
    angular
        .module('ALEX.actions')
        .constant('actionGroupTypes', actionGroupTypes)
        .constant('actionTypes', actionTypes);
}());