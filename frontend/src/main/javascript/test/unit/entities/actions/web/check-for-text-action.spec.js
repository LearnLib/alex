import {Action} from '../../../../../src/js/entities/actions/action';
import {CheckForTextWebAction} from '../../../../../src/js/entities/actions/web/check-for-text-action';
import {actionType} from '../../../../../src/js/constants';

describe('CheckForTextWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckForTextWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CHECK_TEXT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            value: '',
            regexp: false
        };
        const action = new CheckForTextWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
