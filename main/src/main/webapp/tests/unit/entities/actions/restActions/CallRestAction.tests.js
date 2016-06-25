import {Action} from '../../../../../src/js/entities/actions/Action';
import {CallRestAction} from '../../../../../src/js/entities/actions/restActions/CallRestAction';
import {actionType} from '../../../../../src/js/constants';

describe('CallRestAction', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should extend the default action and should implement a toString method', () => {
        const action = new CallRestAction({});
        expect(action instanceof Action).toBe(true);
        expect(angular.isFunction(action.toString)).toBe(true);
    });

    it('should have create a default action', () => {
        const expectedAction = {
            type: actionType.REST_CALL,
            negated: false,
            ignoreFailure: false,
            disabled: false,

            method: 'GET',
            url: '',
            data: null,
            cookies: {},
            headers: {},
            credentials: {}
        };
        const action = new CallRestAction({});
        expect(angular.toJson(action)).toEqual(angular.toJson(expectedAction));
    });

    it('should set a cookie', () => {
        const action = new CallRestAction({});
        const cookieName = 'cookie';
        const cookieValue = 'value';

        expect(action.cookies[cookieName]).toBeUndefined();
        action.addCookie(cookieName, cookieValue);
        expect(action.cookies[cookieName]).toEqual(cookieValue);
    });

    it('should set a header', () => {
        const action = new CallRestAction({});
        const headerName = 'header';
        const headerValue = 'value';

        expect(action.headers[headerName]).toBeUndefined();
        action.addHeader(headerName, headerValue);
        expect(action.headers[headerName]).toEqual(headerValue);
    });

    it('should remove a cookie', () => {
        const action = new CallRestAction({});
        const cookieName = 'cookie';
        const cookieValue = 'value';

        action.addCookie(cookieName, cookieValue);
        action.removeCookie(cookieName);
        expect(action.cookies[cookieName]).toBeUndefined();
    });

    it('should remove a header', () => {
        const action = new CallRestAction({});
        const headerName = 'header';
        const headerValue = 'value';

        action.addHeader(headerName, headerValue);
        action.removeHeader(headerName);
        expect(action.headers[headerName]).toBeUndefined();
    })
});