import Action from '../../../../../app/modules/entities/actions/Action';
import CheckAttributeValueRestAction from '../../../../../app/modules/entities/actions/restActions/CheckAttributeValueRestAction';
import {actionType} from '../../../../../app/modules/constants';

describe('CheckAttributeValueRestAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckAttributeValueRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_ATTRIBUTE_VALUE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            attribute: '',
            value: '',
            regexp: false
        };
        const action = new CheckAttributeValueRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});