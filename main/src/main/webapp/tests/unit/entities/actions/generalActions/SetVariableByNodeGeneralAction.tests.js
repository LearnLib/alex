import Action from '../../../../../app/modules/entities/actions/Action';
import SetVariableByNodeGeneralAction from '../../../../../app/modules/entities/actions/generalActions/SetVariableByNodeGeneralAction';
import {actionType} from '../../../../../app/modules/constants';

describe('SetVariableByNodeGeneralAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SetVariableByNodeGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_SET_VARIABLE_BY_HTML,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            value: ''
        };
        const action = new SetVariableByNodeGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
