describe('ExecuteSymbolGeneralAction', () => {
    let Action;
    let ExecuteSymbolGeneralAction;
    let actionType;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        ExecuteSymbolGeneralAction = $injector.get('ExecuteSymbolGeneralAction');
        Action = $injector.get('Action');
        actionType = $injector.get('actionType');
    }));

    it('should extend the default action and should implement a toString method', () => {
        const action = new ExecuteSymbolGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_EXECUTE_SYMBOL,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            symbolToExecute: {id: null, revision: null}
        };
        const action = new ExecuteSymbolGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});