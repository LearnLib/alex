import {Action} from '../../../../../src/js/entities/actions/Action';
import {CheckAttributeExistsRestAction} from '../../../../../src/js/entities/actions/restActions/CheckAttributeExistsRestAction';
import {actionType} from '../../../../../src/js/constants';

describe('CheckAttributeExistsRestAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckAttributeExistsRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_ATTRIBUTE_EXISTS,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            attribute: ''
        };
        const action = new CheckAttributeExistsRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});