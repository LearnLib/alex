import {Action} from '../../../../../src/js/entities/actions/Action';
import {SubmitWebAction} from '../../../../../src/js/entities/actions/webActions/SubmitWebAction';
import {actionType} from '../../../../../src/js/constants';

describe('SubmitWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new SubmitWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_SUBMIT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            node: {
                selector: '',
                type: 'CSS'
            }
        };
        const action = new SubmitWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
