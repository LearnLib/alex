import Action from '../../../../../app/modules/entities/actions/Action';
import AssertVariableAction from '../../../../../app/modules/entities/actions/generalActions/AssertVariableAction';
import {actionType} from '../../../../../app/modules/constants';

describe('AssertVariableAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new AssertVariableAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_ASSERT_VARIABLE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            value: '',
            regexp: false
        };
        const action = new AssertVariableAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
