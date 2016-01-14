import {User} from '../../../../app/modules/entities/User';

describe('UsersSettingsViewComponent', () => {
    let scope;
    let $q;
    let $rootScope;
    let $compile;
    let $controller;
    let UserResource;
    let SessionService;
    let ToastService;
    let controller;

    let user;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$rootScope_, _$compile_, _$q_, _$controller_, _UserResource_, _SessionService_, _ToastService_) => {
        scope = _$rootScope_.$new();
        $q = _$q_;
        $controller = _$controller_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        UserResource = _UserResource_;
        SessionService = _SessionService_;
        ToastService = _ToastService_;

        user = ENTITIES.users[0];
        SessionService.saveUser(user);
    }));

    function createController() {
        const element = angular.element("<users-settings-view></users-settings-view>");
        const renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('usersSettingsView');
    }

    it('should get the project from the server and save it', () => {
        let deferred = $q.defer();
        spyOn(UserResource, 'get').and.returnValue(deferred.promise);
        createController();
        deferred.resolve(new User(user));
        scope.$digest();

        expect(UserResource.get).toHaveBeenCalledWith(user.id);
        expect(controller.user instanceof User).toBeTruthy();
    });

    it('should display a toast danger message if the user could not be fetched from the server', () => {
        let deferred = $q.defer();
        spyOn(UserResource, 'get').and.returnValue(deferred.promise);
        spyOn(ToastService, 'danger').and.callThrough();
        createController();
        deferred.reject({data: {message: null}});
        scope.$digest();

        expect(UserResource.get).toHaveBeenCalledWith(user.id);
        expect(ToastService.danger).toHaveBeenCalled();
        expect(controller.user).toBeNull();
    })
});