import Action from '../../../../../app/modules/entities/actions/Action';
import CheckForNodeWebAction from '../../../../../app/modules/entities/actions/webActions/CheckForNodeWebAction';
import {actionType} from '../../../../../app/modules/constants';

describe('CheckForNodeWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckForNodeWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CHECK_NODE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            value: ''
        };
        const action = new CheckForNodeWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});