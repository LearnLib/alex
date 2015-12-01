describe('CheckHTTPBodyTextRestAction', () => {
    let Action;
    let CheckHTTPBodyTextRestAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        CheckHTTPBodyTextRestAction = $injector.get('CheckHTTPBodyTextRestAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckHTTPBodyTextRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_FOR_TEXT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            value: '',
            regexp: false
        };
        const action = new CheckHTTPBodyTextRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});