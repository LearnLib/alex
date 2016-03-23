import Action from '../../../../../src/js/entities/actions/Action';
import WaitForNodeAction from '../../../../../src/js/entities/actions/webActions/WaitForNodeAction';
import {actionType} from '../../../../../src/js/constants';

describe('WaitForNodeAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new WaitForNodeAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WAIT_FOR_NODE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            waitCriterion: 'VISIBLE',
            node: '',
            maxWaitTime: 10
        };
        const action = new WaitForNodeAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
