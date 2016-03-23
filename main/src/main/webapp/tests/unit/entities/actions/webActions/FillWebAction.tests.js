import Action from '../../../../../src/js/entities/actions/Action';
import FillWebAction from '../../../../../src/js/entities/actions/webActions/FillWebAction';
import {actionType} from '../../../../../src/js/constants';

describe('FillWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new FillWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_FILL,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            node: '',
            value: ''
        };
        const action = new FillWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
