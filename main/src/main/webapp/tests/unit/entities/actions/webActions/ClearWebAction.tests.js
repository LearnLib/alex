import Action from '../../../../../src/js/entities/actions/Action';
import ClearWebAction from '../../../../../src/js/entities/actions/webActions/ClearWebAction';
import {actionType} from '../../../../../src/js/constants';

describe('ClearWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new ClearWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CLEAR,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            node: ''
        };
        const action = new ClearWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
