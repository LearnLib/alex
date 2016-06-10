import Action from '../../../../../src/js/entities/actions/Action';
import ExecuteScriptAction from '../../../../../src/js/entities/actions/webActions/ExecuteScriptAction';
import {actionType} from '../../../../../src/js/constants';

describe('ExecuteScriptAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new ExecuteScriptAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_EXECUTE_SCRIPT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            script: null
        };
        const action = new ExecuteScriptAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
