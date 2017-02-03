import {Action} from '../../../../../src/js/entities/actions/Action';
import {CheckForNodeWebAction} from '../../../../../src/js/entities/actions/webActions/CheckForNodeWebAction';
import {actionType} from '../../../../../src/js/constants';

describe('CheckForNodeWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CheckForNodeWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CHECK_NODE,
            negated: false,
            ignoreFailure: false,
            disabled: false,
            node: {
                selector: '',
                type: 'CSS'
            }
        };
        const action = new CheckForNodeWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});