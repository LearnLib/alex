describe('CheckAttributeTypeRestAction', () => {
    let Action;
    let CheckAttributeTypeRestAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        CheckAttributeTypeRestAction = $injector.get('CheckAttributeTypeRestAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckAttributeTypeRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_ATTRIBUTE_TYPE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            attribute: '',
            jsonType: 'STRING'
        };
        const action = new CheckAttributeTypeRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});