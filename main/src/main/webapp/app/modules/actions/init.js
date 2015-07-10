(function () {
    'use strict';

    angular
        .module('ALEX.actions', [])
        .run(run);

    run.$inject = ['$injector', 'ActionService', 'actionGroupTypes', 'actionTypes'];

    function run($injector, ActionService, groups, actions) {

        // register all actions so that they can be accessed in the action editor
        ActionService

            // register web actions in module
            .register(groups.WEB, actions[groups.WEB].CLEAR, $injector.get('ClearWebAction'))
            .register(groups.WEB, actions[groups.WEB].CLICK, $injector.get('ClickWebAction'))
            .register(groups.WEB, actions[groups.WEB].CHECK_FOR_TEXT, $injector.get('CheckForTextWebAction'))
            .register(groups.WEB, actions[groups.WEB].CHECK_FOR_NODE, $injector.get('CheckForNodeWebAction'))
            .register(groups.WEB, actions[groups.WEB].CHECK_PAGE_TITLE, $injector.get('CheckPageTitleAction'))
            .register(groups.WEB, actions[groups.WEB].CLICK_LINK_BY_TEXT, $injector.get('ClickLinkByTextWebAction'))
            .register(groups.WEB, actions[groups.WEB].FILL, $injector.get('FillWebAction'))
            .register(groups.WEB, actions[groups.WEB].GO_TO, $injector.get('GoToWebAction'))
            .register(groups.WEB, actions[groups.WEB].SELECT, $injector.get('SelectWebAction'))
            .register(groups.WEB, actions[groups.WEB].SUBMIT, $injector.get('SubmitWebAction'))

            // register rest actions in module
            .register(groups.REST, actions[groups.REST].CALL_URL, $injector.get('CallRestAction'))
            .register(groups.REST, actions[groups.REST].CHECK_ATTRIBUTE_EXISTS, $injector.get('CheckAttributeExistsRestAction'))
            .register(groups.REST, actions[groups.REST].CHECK_ATTRIBUTE_TYPE, $injector.get('CheckAttributeTypeRestAction'))
            .register(groups.REST, actions[groups.REST].CHECK_ATTRIBUTE_VALUE, $injector.get('CheckAttributeValueRestAction'))
            .register(groups.REST, actions[groups.REST].CHECK_HEADER_FIELD, $injector.get('CheckHeaderFieldRestAction'))
            .register(groups.REST, actions[groups.REST].CHECK_HTTP_BODY_TEXT, $injector.get('CheckHTTPBodyTextRestAction'))
            .register(groups.REST, actions[groups.REST].CHECK_STATUS, $injector.get('CheckStatusRestAction'))

            // register general actions in module
            .register(groups.GENERAL, actions[groups.GENERAL].EXECUTE_SYMBOL, $injector.get('ExecuteSymbolGeneralAction'))
            .register(groups.GENERAL, actions[groups.GENERAL].INCREMENT_COUNTER, $injector.get('IncrementCounterGeneralAction'))
            .register(groups.GENERAL, actions[groups.GENERAL].SET_COUNTER, $injector.get('SetCounterGeneralAction'))
            .register(groups.GENERAL, actions[groups.GENERAL].SET_VARIABLE, $injector.get('SetVariableGeneralAction'))
            .register(groups.GENERAL, actions[groups.GENERAL].SET_VARIABLE_BY_COOKIE, $injector.get('SetVariableByCookieAction'))
            .register(groups.GENERAL, actions[groups.GENERAL].SET_VARIABLE_BY_JSON_ATTRIBUTE, $injector.get('SetVariableByJsonAttributeGeneralAction'))
            .register(groups.GENERAL, actions[groups.GENERAL].SET_VARIABLE_BY_NODE, $injector.get('SetVariableByNodeGeneralAction'))
            .register(groups.GENERAL, actions[groups.GENERAL].WAIT, $injector.get('WaitGeneralAction'));
    }
}());