describe('IncrementCounterGeneralAction', () => {
    let Action;
    let IncrementCounterGeneralAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        IncrementCounterGeneralAction = $injector.get('IncrementCounterGeneralAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new IncrementCounterGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_INCREMENT_COUNTER,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: ''
        };
        const action = new IncrementCounterGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
