describe('SetVariableGeneralAction', () => {
    let Action;
    let SetVariableGeneralAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        SetVariableGeneralAction = $injector.get('SetVariableGeneralAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SetVariableGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_SET_VARIABLE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            value: ''
        };
        const action = new SetVariableGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
