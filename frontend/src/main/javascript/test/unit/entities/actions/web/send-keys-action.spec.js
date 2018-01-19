import {Action} from '../../../../../src/js/entities/actions/action';
import {FillWebAction} from '../../../../../src/js/entities/actions/web/send-keys-action';
import {actionType} from '../../../../../src/js/constants';

describe('FillWebAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new FillWebAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_FILL,
            negated: false,
            ignoreFailure: false,
            disabled: false,
            node: {
                selector: '',
                type: 'CSS'
            },
            value: ''
        };
        const action = new FillWebAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
