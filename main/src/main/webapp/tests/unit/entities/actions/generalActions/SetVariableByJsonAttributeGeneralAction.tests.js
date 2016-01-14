import Action from '../../../../../app/modules/entities/actions/Action';
import SetVariableByJsonAttributeGeneralAction from '../../../../../app/modules/entities/actions/generalActions/SetVariableByJsonAttributeGeneralAction';
import {actionType} from '../../../../../app/modules/constants';

describe('SetVariableByJsonAttributeGeneralAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SetVariableByJsonAttributeGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_SET_VARIABLE_BY_JSON,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            value: ''
        };
        const action = new SetVariableByJsonAttributeGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
