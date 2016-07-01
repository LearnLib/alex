describe('userRegisterForm', () => {
    let $rootScope, $compile, $q, UserResource, ToastService;
    let renderedElement, controller;
    const USER = {
        email: 'email',
        password: 'password'
    };

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');
        UserResource = $injector.get('UserResource');
        ToastService = $injector.get('ToastService');

        const element = angular.element(`
            <user-register-form></user-register-form>
        `);
        const scope = $rootScope.$new();
        renderedElement = $compile(element)(scope);
        controller = element.controller('userRegisterForm');
        $rootScope.$digest();
    }));

    it('should do nothing if no user credentials have been entered', () => {
        spyOn(UserResource, 'create').and.callThrough();
        controller.register();
        expect(UserResource.create).not.toHaveBeenCalled();
    });

    it('should show a message if registration has failed', () => {
        spyOn(ToastService, 'danger').and.callThrough();

        const deferred = $q.defer();
        spyOn(UserResource, 'create').and.returnValue(deferred.promise);
        deferred.reject({data: {message: null}});

        controller.email = USER.email;
        controller.password = USER.password;
        controller.register();
        $rootScope.$digest();

        expect(UserResource.create).toHaveBeenCalledWith(USER.email, USER.password);
        expect(ToastService.danger).toHaveBeenCalled();
    });

    it('should reset the form on successful registration', () => {
        const deferred = $q.defer();
        spyOn(UserResource, 'create').and.returnValue(deferred.promise);
        deferred.resolve({});

        spyOn(ToastService, 'success').and.callThrough();

        controller.email = USER.email;
        controller.password = USER.password;
        controller.register();
        $rootScope.$digest();

        expect(ToastService.success).toHaveBeenCalled();
        expect(controller.email).toBeNull()
        expect(controller.password).toBeNull()
    });
});