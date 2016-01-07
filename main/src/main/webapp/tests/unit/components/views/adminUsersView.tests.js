describe('AdminUsersViewComponent', () => {
    let $controller;
    let $rootScope;
    let $compile;
    let scope;
    let UserResource;
    let EventBus;
    let events;
    let User;

    let users;
    let deferred;
    let controller;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$controller_, _$compile_, _$rootScope_, _UserResource_, _EventBus_, _events_, _User_, _$q_) => {
        scope = _$rootScope_.$new();
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        UserResource = _UserResource_;
        EventBus = _EventBus_;
        events = _events_;
        User = _User_;

        users = ENTITIES.users.map(u => new User(u));
        deferred = _$q_.defer();
    }));

    function createController() {
        const element = angular.element("<admin-users-view></admin-users-view>");
        const renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('adminUsersView');
    }

    it('should correctly initialize the controller and load all users', () => {
        spyOn(UserResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(users);
        createController();
        scope.$digest();

        expect(UserResource.getAll).toHaveBeenCalled();
        expect(controller.users).toEqual(users);
    });

    it('should display an error message if getting all users failed', () => {
        spyOn(UserResource, 'getAll').and.returnValue(deferred.promise);
        deferred.reject({data: {message: null}});
        createController();
        scope.$digest();

        expect(UserResource.getAll).toHaveBeenCalled();
        expect(controller.users).toEqual([]);
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
        expect(controller.users.length).toBe(users.length);
        expect(controller.users.find(u => u.email === mail)).toEqual(user);
    });

    it('should correctly remove a user from the list on event user:deleted', () => {
        spyOn(UserResource, 'getAll').and.returnValue(deferred.promise);
        deferred.resolve(users);
        createController();
        scope.$digest();

        const user = users[1];
        const l = controller.users.length;

        expect(controller.users.find(u => u.id === user.id)).toEqual(user);
        EventBus.emit(events.USER_DELETED, {user: user});
        expect(controller.users.length).toBe(l -1);
        expect(controller.users.find(u => u.id === user.id)).toBeUndefined();
    });
});