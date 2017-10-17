describe('userEditForm', () => {
    let $rootScope, $compile, $q, UserResource, PromptService, $state, ToastService, SessionService;
    let renderedElement, controller, scope;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');
        UserResource = $injector.get('UserResource');
        ToastService = $injector.get('ToastService');
        SessionService = $injector.get('SessionService');
        PromptService = $injector.get('PromptService');
        $state = $injector.get('$state');

        scope = $rootScope.$new();
        scope.user = ENTITIES.users[0];
        const element = angular.element(`
            <user-edit-form user="user"></user-edit-form>
        `);
        renderedElement = $compile(element)(scope);
        controller = element.controller('userEditForm');
        $rootScope.$digest();

        SessionService.saveUser(controller.user);
    }));
    afterEach(() => {
        SessionService.removeUser();
    });

    // email

    it('should not change the email if the form is empty', () => {
        spyOn(UserResource, 'changeEmail').and.callThrough();
        controller.email = '';
        controller.changeEmail();
        expect(UserResource.changeEmail).not.toHaveBeenCalled();
    });

    it('should change the email of a user', () => {
        spyOn(SessionService, 'saveUser').and.callThrough();

        const deferred = $q.defer();
        spyOn(UserResource, 'changeEmail').and.returnValue(deferred.promise);
        deferred.resolve({});

        controller.changeEmail();
        $rootScope.$digest();

        expect(UserResource.changeEmail).toHaveBeenCalledWith(controller.user, controller.email);
        expect(SessionService.saveUser).toHaveBeenCalled();
    });

    it('should display a message if the email of the user could not be updated', () => {
        spyOn(ToastService, 'danger').and.callThrough();

        const deferred = $q.defer();
        spyOn(UserResource, 'changeEmail').and.returnValue(deferred.promise);
        deferred.reject({data: {message: null}});

        controller.changeEmail();
        $rootScope.$digest();

        expect(UserResource.changeEmail).toHaveBeenCalledWith(controller.user, controller.email);
        expect(ToastService.danger).toHaveBeenCalled();
    });

    // password

    it('should not change the password if the form is empty', () => {
        spyOn(UserResource, 'changePassword').and.callThrough();
        controller.changePassword();
        expect(UserResource.changePassword).not.toHaveBeenCalled();
    });

    it('should not change the password if new and old one are equal', () => {
        spyOn(UserResource, 'changePassword').and.callThrough();
        controller.oldPassword = 'pw';
        controller.newPassword = 'pw';
        controller.changePassword();
        expect(UserResource.changePassword).not.toHaveBeenCalled();
    });

    it('should change the password of the user', () => {
        const deferred = $q.defer();
        spyOn(UserResource, 'changePassword').and.returnValue(deferred.promise);
        deferred.resolve({});

        controller.oldPassword = 'pw';
        controller.newPassword = 'pw2';
        controller.changePassword();
        $rootScope.$digest();

        expect(UserResource.changePassword).toHaveBeenCalledWith(controller.user, 'pw', 'pw2');
        expect(controller.newPassword).toEqual('');
        expect(controller.oldPassword).toEqual('');
    });

    it('should display a message if the password could not be changed', () => {
        const deferred = $q.defer();
        spyOn(UserResource, 'changePassword').and.returnValue(deferred.promise);
        deferred.reject({data: {message: null}});
        spyOn(ToastService, 'danger').and.callThrough();

        controller.oldPassword = 'pw';
        controller.newPassword = 'pw2';
        controller.changePassword();
        $rootScope.$digest();

        expect(UserResource.changePassword).toHaveBeenCalledWith(controller.user, 'pw', 'pw2');
        expect(ToastService.danger).toHaveBeenCalled();
        expect(controller.oldPassword).toEqual('pw');
        expect(controller.newPassword).toEqual('pw2');
    });

    // account

    it('should not delete the user if the prompt has not been confirmed', () => {
        const deferred = $q.defer();
        spyOn(UserResource, 'remove').and.callThrough();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);
        deferred.reject({});

        expect(UserResource.remove).not.toHaveBeenCalled();
    });

    it('should delete a user', () => {
        const d1 = $q.defer();
        const d2 = $q.defer();
        spyOn(UserResource, 'remove').and.returnValue(d1.promise);
        spyOn(PromptService, 'confirm').and.returnValue(d2.promise);
        spyOn($state, 'go');

        d2.resolve({});
        d1.resolve({});

        controller.deleteUser();
        $rootScope.$digest();

        expect(UserResource.remove).toHaveBeenCalledWith(controller.user);
        expect(SessionService.getUser()).toBeNull();
        expect($state.go).toHaveBeenCalledWith('home');
    });

    it('should display a message if the user could not be deleted', () => {
        const d1 = $q.defer();
        const d2 = $q.defer();
        spyOn(ToastService, 'danger').and.callThrough();
        spyOn(UserResource, 'remove').and.returnValue(d1.promise);
        spyOn(PromptService, 'confirm').and.returnValue(d2.promise);
        d2.resolve({});
        d1.reject({data: {message: null}});

        controller.deleteUser();
        $rootScope.$digest();

        expect(UserResource.remove).toHaveBeenCalledWith(controller.user);
        expect(ToastService.danger).toHaveBeenCalled();
    })
});