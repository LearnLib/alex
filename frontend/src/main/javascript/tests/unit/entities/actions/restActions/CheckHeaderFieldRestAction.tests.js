import {Action} from '../../../../../src/js/entities/actions/Action';
import {CheckHeaderFieldRestAction} from '../../../../../src/js/entities/actions/restActions/CheckHeaderFieldRestAction';
import {actionType} from '../../../../../src/js/constants';

describe('CheckHeaderFieldRestAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckHeaderFieldRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_HEADER_FIELD,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            key: '',
            value: '',
            regexp: false
        };
        const action = new CheckHeaderFieldRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});