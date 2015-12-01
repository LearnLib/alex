describe('CheckForTextWebAction', () => {
    let Action;
    let CheckForTextWebAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        CheckForTextWebAction = $injector.get('CheckForTextWebAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckForTextWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CHECK_TEXT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            value: '',
            regexp: false
        };
        const action = new CheckForTextWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});