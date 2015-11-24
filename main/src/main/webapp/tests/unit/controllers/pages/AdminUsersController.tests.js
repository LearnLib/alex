describe('AdminUsersController', () => {
    let AdminUsersController;
    let $controller;
    let scope;
    let UserResource;
    let EventBus;
    let events;
    let User;

    let users;
    let deferred;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$controller_, _$rootScope_, _UserResource_, _EventBus_, _events_, _User_, _$q_) => {
        scope = _$rootScope_.$new();
        $controller = _$controller_;
        UserResource = _UserResource_;
        EventBus = _EventBus_;
        events = _events_;
        User = _User_;

        users = ENTITIES.users.map(u => new User(u));
        deferred = _$q_.defer();
    }));

    function createController() {
        AdminUsersController = $controller('AdminUsersController', {
            $scope: scope,
            UserResource: UserResource,
            EventBus: EventBus
        });
    }

    it('should correctly initialize the controller and load all users', () => {
        spyOn(UserResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(users);
        createController();
        scope.$digest();

        expect(UserResource.getAll).toHaveBeenCalled();
        expect(AdminUsersController.users).toEqual(users);
    });

    it('should display an error message if getting all users failed', () => {
        spyOn(UserResource, 'getAll').and.returnValue(deferred.promise);
        deferred.reject({data: {message: null}});
        createController();
        scope.$digest();

        expect(UserResource.getAll).toHaveBeenCalled();
        expect(AdminUsersController.users).toEqual([]);
    });

    it('should correctly update an existing user on event user:updated', () => {
        spyOn(UserResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(users);
        createController();
        scope.$digest();

        const user = users[1];
        const mail = 'newmail@alex.example';
        user.email = mail;

        EventBus.emit(events.USER_UPDATED, {user: user});
        expect(AdminUsersController.users.length).toBe(users.length);
        expect(AdminUsersController.users.find(u => u.email === mail)).toEqual(user);
    });

    it('should correctly remove a user from the list on event user:deleted', () => {
        spyOn(UserResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(users);
        createController();
        scope.$digest();

        const user = users[1];
        const l = AdminUsersController.users.length;

        expect(AdminUsersController.users.find(u => u.id === user.id)).toEqual(user);
        EventBus.emit(events.USER_DELETED, {user: user});
        expect(AdminUsersController.users.length).toBe(l -1);
        expect(AdminUsersController.users.find(u => u.id === user.id)).toBeUndefined();
    });
});