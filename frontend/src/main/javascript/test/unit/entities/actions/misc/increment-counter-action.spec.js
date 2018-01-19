import {Action} from '../../../../../src/js/entities/actions/action';
import {IncrementCounterGeneralAction} from '../../../../../src/js/entities/actions/misc/increment-counter-action';
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
            name: '',
            incrementBy: 1,
        };
        const action = new IncrementCounterGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
