import Action from '../../../../../src/js/entities/actions/Action';
import GoToWebAction from '../../../../../src/js/entities/actions/webActions/GoToWebAction';
import {actionType} from '../../../../../src/js/constants';

describe('GoToWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new GoToWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_GO_TO,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            url: ''
        };
        const action = new GoToWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
