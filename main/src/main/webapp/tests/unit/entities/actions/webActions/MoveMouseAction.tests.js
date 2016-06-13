import Action from "../../../../../src/js/entities/actions/Action";
import MoveMouseAction from "../../../../../src/js/entities/actions/webActions/MoveMouseAction";
import {actionType} from "../../../../../src/js/constants";

describe('MoveMouseAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new MoveMouseAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should create a default action', () => {
        const expectedAction = {
            type: actionType.WEB_MOUSE_MOVE,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            node: null,
            offsetX: 0,
            offsetY: 0
        };
        const action = new MoveMouseAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });
});
