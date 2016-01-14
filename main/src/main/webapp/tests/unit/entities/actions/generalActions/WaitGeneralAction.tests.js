import Action from '../../../../../app/modules/entities/actions/Action';
import WaitGeneralAction from '../../../../../app/modules/entities/actions/generalActions/WaitGeneralAction';
import {actionType} from '../../../../../app/modules/constants';

describe('WaitGeneralAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new WaitGeneralAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.GENERAL_WAIT,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            duration: 0
        };
        const action = new WaitGeneralAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
