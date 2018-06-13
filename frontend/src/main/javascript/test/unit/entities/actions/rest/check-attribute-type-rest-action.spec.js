import {Action} from '../../../../../src/js/entities/actions/action';
import {CheckAttributeTypeRestAction} from '../../../../../src/js/entities/actions/rest/check-attribute-type-action';
import {actionType} from '../../../../../src/js/constants';

describe('CheckAttributeTypeRestAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckAttributeTypeRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_ATTRIBUTE_TYPE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            attribute: '',
            jsonType: 'STRING'
        };
        const action = new CheckAttributeTypeRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
