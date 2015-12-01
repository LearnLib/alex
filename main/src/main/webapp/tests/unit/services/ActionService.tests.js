describe('ActionService', () => {
    let ActionService;

    // web actions
    let CheckForNodeWebAction, CheckForTextWebAction, CheckPageTitleAction, ClearWebAction, ClickLinkByTextWebAction,
        ClickWebAction, FillWebAction, GoToWebAction, SelectWebAction, SubmitWebAction;

    // rest actions
    let CallRestAction, CheckAttributeExistsRestAction, CheckAttributeTypeRestAction, CheckAttributeValueRestAction,
        CheckHeaderFieldRestAction, CheckHTTPBodyTextRestAction, CheckStatusRestAction;

    // general actions
    let AssertCounterAction, AssertVariableAction, ExecuteSymbolGeneralAction, IncrementCounterGeneralAction,
        SetCounterGeneralAction, SetVariableByCookieAction, SetVariableByJsonAttributeGeneralAction,
        SetVariableByNodeGeneralAction, SetVariableGeneralAction, WaitGeneralAction;

    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject($injector => {
        ActionService = $injector.get('ActionService');

        // web actions
        CheckForNodeWebAction = $injector.get('CheckForNodeWebAction');
        CheckForTextWebAction = $injector.get('CheckForTextWebAction');
        CheckPageTitleAction = $injector.get('CheckPageTitleAction');
        ClearWebAction = $injector.get('ClearWebAction');
        ClickLinkByTextWebAction = $injector.get('ClickLinkByTextWebAction');
        ClickWebAction = $injector.get('ClickWebAction');
        FillWebAction = $injector.get('FillWebAction');
        GoToWebAction = $injector.get('GoToWebAction');
        SelectWebAction = $injector.get('SelectWebAction');
        SubmitWebAction = $injector.get('SubmitWebAction');

        // rest actions
        CallRestAction = $injector.get('CallRestAction');
        CheckAttributeExistsRestAction = $injector.get('CheckAttributeExistsRestAction');
        CheckAttributeTypeRestAction = $injector.get('CheckAttributeTypeRestAction');
        CheckAttributeValueRestAction = $injector.get('CheckAttributeValueRestAction');
        CheckHeaderFieldRestAction = $injector.get('CheckHeaderFieldRestAction');
        CheckHTTPBodyTextRestAction = $injector.get('CheckHTTPBodyTextRestAction');
        CheckStatusRestAction = $injector.get('CheckStatusRestAction');

        // general actions
        AssertCounterAction = $injector.get('AssertCounterAction');
        AssertVariableAction = $injector.get('AssertVariableAction');
        ExecuteSymbolGeneralAction = $injector.get('ExecuteSymbolGeneralAction');
        IncrementCounterGeneralAction = $injector.get('IncrementCounterGeneralAction');
        SetCounterGeneralAction = $injector.get('SetCounterGeneralAction');
        SetVariableByCookieAction = $injector.get('SetVariableByCookieAction');
        SetVariableByJsonAttributeGeneralAction = $injector.get('SetVariableByJsonAttributeGeneralAction');
        SetVariableByNodeGeneralAction = $injector.get('SetVariableByNodeGeneralAction');
        SetVariableGeneralAction = $injector.get('SetVariableGeneralAction');
        WaitGeneralAction = $injector.get('WaitGeneralAction');

        actionType = $injector.get('actionType');
    }));

    it('should correctly create web actions from a given type', () => {
        let action = ActionService.createFromType(actionType.WEB_CHECK_NODE);
        expect(action instanceof CheckForNodeWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CHECK_TEXT);
        expect(action instanceof CheckForTextWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CHECK_PAGE_TITLE);
        expect(action instanceof CheckPageTitleAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CLEAR);
        expect(action instanceof ClearWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CLICK_LINK_BY_TEXT);
        expect(action instanceof ClickLinkByTextWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CLICK);
        expect(action instanceof ClickWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_FILL);
        expect(action instanceof FillWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_GO_TO);
        expect(action instanceof GoToWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_SELECT);
        expect(action instanceof SelectWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_SUBMIT);
        expect(action instanceof SubmitWebAction).toBe(true);
    });

    it('should should correctly create rest actions from a given type', () => {
        let action = ActionService.createFromType(actionType.REST_CALL);
        expect(action instanceof CallRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_ATTRIBUTE_EXISTS);
        expect(action instanceof CheckAttributeExistsRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_ATTRIBUTE_TYPE);
        expect(action instanceof CheckAttributeTypeRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_ATTRIBUTE_VALUE);
        expect(action instanceof CheckAttributeValueRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_FOR_TEXT);
        expect(action instanceof CheckHTTPBodyTextRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_HEADER_FIELD);
        expect(action instanceof CheckHeaderFieldRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_STATUS);
        expect(action instanceof CheckStatusRestAction).toBe(true);
    });

    it('should correctly create general actions from a given type', () => {
        let action = ActionService.createFromType(actionType.GENERAL_ASSERT_COUNTER);
        expect(action instanceof AssertCounterAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_ASSERT_VARIABLE);
        expect(action instanceof AssertVariableAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_EXECUTE_SYMBOL);
        expect(action instanceof ExecuteSymbolGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_INCREMENT_COUNTER);
        expect(action instanceof IncrementCounterGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_COUNTER);
        expect(action instanceof SetCounterGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_VARIABLE_BY_COOKIE);
        expect(action instanceof SetVariableByCookieAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_VARIABLE_BY_JSON);
        expect(action instanceof SetVariableByJsonAttributeGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_VARIABLE_BY_HTML);
        expect(action instanceof SetVariableByNodeGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_VARIABLE);
        expect(action instanceof SetVariableGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_WAIT);
        expect(action instanceof WaitGeneralAction).toBe(true);
    })
});