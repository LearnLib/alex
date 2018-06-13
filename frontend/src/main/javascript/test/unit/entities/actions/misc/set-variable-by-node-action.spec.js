import {Action} from '../../../../../src/js/entities/actions/action';
import {SetVariableByNodeGeneralAction} from '../../../../../src/js/entities/actions/misc/set-variable-by-node-action';
import {actionType} from '../../../../../src/js/constants';

describe('SetVariableByNodeGeneralAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SetVariableByNodeGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_SET_VARIABLE_BY_HTML,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            node: {
                selector: '',
                type: 'CSS'
            }
        };
        const action = new SetVariableByNodeGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
