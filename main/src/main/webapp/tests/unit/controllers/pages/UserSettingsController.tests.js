describe('UserSettingsController', () => {
    let scope;
    let $q;
    let $controller;
    let UserResource;
    let SessionService;
    let ToastService;
    let User;
    let UserSettingsController;

    let user;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$rootScope_, _$q_, _$controller_, _UserResource_, _SessionService_, _ToastService_, _User_) => {
        scope = _$rootScope_.$new();
        $q = _$q_;
        $controller = _$controller_;
        UserResource = _UserResource_;
        SessionService = _SessionService_;
        ToastService = _ToastService_;
        User = _User_;

        user = ENTITIES.users[0];
        SessionService.saveUser(user);
    }));

    function createController() {
        UserSettingsController = $controller('UserSettingsController', {
            UserResource: UserResource,
            SessionService: SessionService,
            ToastService: ToastService
        });
    }

    it('should initialize the controller with a null user', () => {
        createController();
        expect(UserSettingsController.user).toBeNull();
    });

    it('should get the project from the server and save it', () => {
        let deferred = $q.defer();
        spyOn(UserResource, 'get').and.returnValue(deferred.promise);
        createController();
        deferred.resolve(new User(user));
        scope.$digest();

        expect(UserResource.get).toHaveBeenCalledWith(user.id);
        expect(UserSettingsController.user instanceof User).toBeTruthy();
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
        expect(UserSettingsController.user).toBeNull();
    })
});