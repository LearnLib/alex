describe('CheckForNodeWebAction', () => {
    let Action;
    let CheckForNodeWebAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        CheckForNodeWebAction = $injector.get('CheckForNodeWebAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckForNodeWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CHECK_NODE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            value: ''
        };
        const action = new CheckForNodeWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});