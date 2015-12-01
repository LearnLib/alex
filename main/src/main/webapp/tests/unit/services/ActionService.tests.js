describe('ActionService', () => {
    let ActionService;
    let CallRestAction, CheckAttributeExistsRestAction, CheckAttributeTypeRestAction, CheckAttributeValueRestAction,
        CheckHeaderFieldRestAction, CheckHTTPBodyTextRestAction, CheckStatusRestAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject($injector => {
        ActionService = $injector.get('ActionService');
        CallRestAction = $injector.get('CallRestAction');
        CheckAttributeExistsRestAction = $injector.get('CheckAttributeExistsRestAction');
        CheckAttributeTypeRestAction = $injector.get('CheckAttributeTypeRestAction');
        CheckAttributeValueRestAction = $injector.get('CheckAttributeValueRestAction');
        CheckHeaderFieldRestAction = $injector.get('CheckHeaderFieldRestAction');
        CheckHTTPBodyTextRestAction = $injector.get('CheckHTTPBodyTextRestAction');
        CheckStatusRestAction = $injector.get('CheckStatusRestAction');
        actionType = $injector.get('actionType');
    }));

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
});