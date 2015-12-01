describe('CheckPageTitleAction', () => {
    let Action;
    let CheckPageTitleAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        CheckPageTitleAction = $injector.get('CheckPageTitleAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckPageTitleAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CHECK_PAGE_TITLE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            title: '',
            regexp: false
        };
        const action = new CheckPageTitleAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
