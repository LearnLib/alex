import Action from '../../../../../src/js/entities/actions/Action';
import ExecuteSymbolGeneralAction from '../../../../../src/js/entities/actions/generalActions/ExecuteSymbolGeneralAction';
import {actionType} from '../../../../../src/js/constants';

describe('ExecuteSymbolGeneralAction', () => {
    beforeEach(angular.mock.module('ALEX'));

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