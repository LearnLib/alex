describe('AssertCounterAction', () => {
    let Action;
    let AssertCounterAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        AssertCounterAction = $injector.get('AssertCounterAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new AssertCounterAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_ASSERT_COUNTER,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            value: '',
            operator: 'EQUAL'
        };
        const action = new AssertCounterAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
