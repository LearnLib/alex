import Action from '../../../../../app/modules/entities/actions/Action';
import CheckHTTPBodyTextRestAction from '../../../../../app/modules/entities/actions/restActions/CheckHTTPBodyTextRestAction';
import {actionType} from '../../../../../app/modules/constants';

describe('CheckHTTPBodyTextRestAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckHTTPBodyTextRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CHECK_FOR_TEXT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            value: '',
            regexp: false
        };
        const action = new CheckHTTPBodyTextRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});