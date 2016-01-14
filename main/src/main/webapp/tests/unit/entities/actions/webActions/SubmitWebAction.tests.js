import Action from '../../../../../app/modules/entities/actions/Action';
import SubmitWebAction from '../../../../../app/modules/entities/actions/webActions/SubmitWebAction';
import {actionType} from '../../../../../app/modules/constants';

describe('SubmitWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SubmitWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_SUBMIT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            node: ''
        };
        const action = new SubmitWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
