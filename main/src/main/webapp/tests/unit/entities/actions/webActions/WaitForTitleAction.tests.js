import {Action} from '../../../../../src/js/entities/actions/Action';
import {WaitForTitleAction} from '../../../../../src/js/entities/actions/webActions/WaitForTitleAction';
import {actionType} from '../../../../../src/js/constants';

describe('WaitForNodeAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new WaitForTitleAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WAIT_FOR_TITLE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            waitCriterion: 'IS',
            value: '',
            maxWaitTime: 10
        };
        const action = new WaitForTitleAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
