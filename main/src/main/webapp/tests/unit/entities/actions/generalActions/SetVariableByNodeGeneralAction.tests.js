describe('SetVariableByNodeGeneralAction', () => {
    let Action;
    let SetVariableByNodeGeneralAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        SetVariableByNodeGeneralAction = $injector.get('SetVariableByNodeGeneralAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SetVariableByNodeGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_SET_VARIABLE_BY_HTML,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            value: ''
        };
        const action = new SetVariableByNodeGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
