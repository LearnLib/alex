describe('SelectWebAction', () => {
    let Action;
    let SelectWebAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        SelectWebAction = $injector.get('SelectWebAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SelectWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_SELECT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            node: '',
            value: '',
            selectBy: 'TEXT'
        };
        const action = new SelectWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
