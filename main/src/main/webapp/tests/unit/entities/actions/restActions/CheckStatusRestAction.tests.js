import Action from '../../../../../src/js/entities/actions/Action';
import CheckStatusRestAction from '../../../../../src/js/entities/actions/restActions/CheckStatusRestAction';
import {actionType} from '../../../../../src/js/constants';

describe('CheckStatusRestAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckStatusRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_STATUS,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            status: 200
        };
        const action = new CheckStatusRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});