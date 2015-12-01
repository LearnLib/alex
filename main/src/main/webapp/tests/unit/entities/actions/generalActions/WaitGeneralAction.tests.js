describe('WaitGeneralAction', () => {
    let Action;
    let WaitGeneralAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        WaitGeneralAction = $injector.get('WaitGeneralAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new WaitGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_WAIT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            duration: 0
        };
        const action = new WaitGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
