describe('SetVariableByCookieAction', () => {
    let Action;
    let SetVariableByCookieAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        SetVariableByCookieAction = $injector.get('SetVariableByCookieAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SetVariableByCookieAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_SET_VARIABLE_BY_COOKIE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            value: '',
            cookieType: 'WEB'
        };
        const action = new SetVariableByCookieAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
