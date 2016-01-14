import Action from '../../../../../app/modules/entities/actions/Action';
import CheckForTextWebAction from '../../../../../app/modules/entities/actions/webActions/CheckForTextWebAction';
import {actionType} from '../../../../../app/modules/constants';

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