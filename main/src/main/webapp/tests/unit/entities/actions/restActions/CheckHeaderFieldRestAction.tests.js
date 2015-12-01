describe('CheckHeaderFieldRestAction', () => {
    let Action;
    let CheckHeaderFieldRestAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        CheckHeaderFieldRestAction = $injector.get('CheckHeaderFieldRestAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckHeaderFieldRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_HEADER_FIELD,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            key: '',
            value: '',
            regexp: false
        };
        const action = new CheckHeaderFieldRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});