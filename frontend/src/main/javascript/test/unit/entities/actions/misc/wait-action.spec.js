import {Action} from '../../../../../src/js/entities/actions/action';
import {WaitGeneralAction} from '../../../../../src/js/entities/actions/misc/wait-action';
import {actionType} from '../../../../../src/js/constants';

describe('WaitGeneralAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new WaitGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WAIT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            duration: 0
        };
        const action = new WaitGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
