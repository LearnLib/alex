import {Action} from '../../../../../src/js/entities/actions/action';
import {SetCounterGeneralAction} from '../../../../../src/js/entities/actions/misc/set-counter-action';
import {actionType} from '../../../../../src/js/constants';

describe('SetCounterGeneralAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SetCounterGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_SET_COUNTER,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: '',
            value: '0',
            valueType: 'NUMBER'
        };
        const action = new SetCounterGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
