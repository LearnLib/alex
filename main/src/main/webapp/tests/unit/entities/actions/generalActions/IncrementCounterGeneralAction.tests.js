import {Action} from '../../../../../src/js/entities/actions/Action';
import {IncrementCounterGeneralAction} from '../../../../../src/js/entities/actions/generalActions/IncrementCounterGeneralAction';
import {actionType} from '../../../../../src/js/constants';

describe('IncrementCounterGeneralAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new IncrementCounterGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_INCREMENT_COUNTER,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            name: ''
        };
        const action = new IncrementCounterGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
