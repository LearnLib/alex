import {events} from '../../../../app/modules/constants';

describe('userLoginForm', () => {
    let $rootScope, $compile, $q, UserResource, ToastService, $state, EventBus, SessionService;
    let renderedElement, controller;
    const USER = {
        email: 'email',
        password: 'password'
    };
    const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJSb2xlIjoiQURNSU4ifQ.RXhPN1zkiTE3Z9gfu-2k1hOycIBYFqydj7n-vGHTwHk';

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');
        $state = $injector.get('$state');
        UserResource = $injector.get('UserResource');
        ToastService = $injector.get('ToastService');
        EventBus = $injector.get('EventBus');
        SessionService = $injector.get('SessionService');

        const element = angular.element(`
            <user-login-form></user-login-form>
        `);
        const scope = $rootScope.$new();
        renderedElement = $compile(element)(scope);
        controller = element.controller('userLoginForm');
        $rootScope.$digest();
    }));
    afterEach(() => {
        SessionService.removeUser();
    });

    it('should do nothing if no user credentials have been entered', () => {
        spyOn(UserResource, 'login').and.callThrough();
        controller.login();
        expect(UserResource.login).not.toHaveBeenCalled();
    });

    it('should show a message if login has failed', () => {
        spyOn(ToastService, 'danger').and.callThrough();

        const deferred = $q.defer();
        spyOn(UserResource, 'login').and.returnValue(deferred.promise);
        deferred.reject({data: null});

        controller.user = USER;
        controller.login();
        $rootScope.$digest();

        expect(UserResource.login).toHaveBeenCalledWith(USER);
        expect(ToastService.danger).toHaveBeenCalled();
    });

    it('should save the user in the session and redirect to the projects on success', () => {
        const deferred = $q.defer();
        spyOn(UserResource, 'login').and.returnValue(deferred.promise);
        deferred.resolve({data: {token: JWT}});

        spyOn($state, 'go').and.returnValue(null);
        spyOn(EventBus, 'emit').and.callThrough();
        spyOn(SessionService, 'saveUser').and.callThrough();

        controller.user = USER;
        controller.login();
        $rootScope.$digest();

        expect($state.go).toHaveBeenCalledWith('projects');
        expect(SessionService.saveUser).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalled();
    });
});