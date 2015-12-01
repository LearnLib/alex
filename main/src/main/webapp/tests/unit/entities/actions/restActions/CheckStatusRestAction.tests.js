describe('CheckStatusRestAction', () => {
    let Action;
    let CheckStatusRestAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        CheckStatusRestAction = $injector.get('CheckStatusRestAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckStatusRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_STATUS,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            status: 200
        };
        const action = new CheckStatusRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});