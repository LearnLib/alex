import Action from '../../../../../src/js/entities/actions/Action';
import ClickLinkByTextWebAction from '../../../../../src/js/entities/actions/webActions/ClickLinkByTextWebAction';
import {actionType} from '../../../../../src/js/constants';

describe('ClickLinkByTextWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new ClickLinkByTextWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_CLICK_LINK_BY_TEXT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            value: ''
        };
        const action = new ClickLinkByTextWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
