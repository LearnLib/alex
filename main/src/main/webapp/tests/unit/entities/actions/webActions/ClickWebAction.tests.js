import Action from '../../../../../app/modules/entities/actions/Action';
import ClickWebAction from '../../../../../app/modules/entities/actions/webActions/ClickWebAction';
import {actionType} from '../../../../../app/modules/constants';

describe('ClickWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new ClickWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CLICK,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            node: ''
        };
        const action = new ClickWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
