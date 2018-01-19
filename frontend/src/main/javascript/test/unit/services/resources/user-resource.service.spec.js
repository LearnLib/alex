import {User} from "../../../../src/js/entities/user";

describe('UserResource', () => {
    let UserResource, $http, $q, $httpBackend;
    let user;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        UserResource = $injector.get('UserResource');
        $http = $injector.get('$http');
        $q = $injector.get('$q');
        $httpBackend = $injector.get('$httpBackend');

        user = new User(ENTITIES.users[0]);
    }));

    it('should correctly initialize the resource', () => {
        expect(UserResource.$http).toEqual($http);
    });

    it('should change the password of a user', () => {
        const uri = `/rest/users/${user.id}/password`;
        spyOn($http, 'put').and.callThrough();

        UserResource.changePassword(user, 'pw1', 'pw2');
        expect($http.put).toHaveBeenCalledWith(uri, {oldPassword: 'pw1', newPassword: 'pw2'})
    });

    it('should change the email of a user', () => {
        const uri = `/rest/users/${user.id}/email`;
        spyOn($http, 'put').and.callThrough();

        UserResource.changeEmail(user, 'mail');
        expect($http.put).toHaveBeenCalledWith(uri, {email: 'mail'})
    });

    it('should get a single user by its it and return an instance of the user', () => {
        const uri = `/rest/users/${user.id}`;
        spyOn($http, 'get').and.callThrough();

        $httpBackend.whenGET(uri).respond(200, ENTITIES.users[0]);
        const promise = UserResource.get(user.id);
        $httpBackend.flush();

        expect(UserResource.$http.get).toHaveBeenCalledWith(uri);
        promise.then((user) => {
            expect(user instanceof User);
        })
    });

    it('should get all users', () => {
        const uri = `/rest/users`;
        spyOn($http, 'get').and.callThrough();

        $httpBackend.whenGET(uri).respond(200, ENTITIES.users);
        const promise = UserResource.getAll();
        $httpBackend.flush();

        expect(UserResource.$http.get).toHaveBeenCalledWith(uri);
        promise.then((users) => {
            users.forEach(u => expect(u instanceof User));
        })
    });

    it('should create a new user', () => {
        const uri = `/rest/users`;
        spyOn($http, 'post').and.callThrough();

        $httpBackend.whenPOST(uri).respond(201, ENTITIES.users[0]);
        const promise = UserResource.create('mail', 'pw');
        $httpBackend.flush();

        expect(UserResource.$http.post).toHaveBeenCalledWith(uri, {
            email: 'mail',
            password: 'pw'
        });
        promise.then((u) => {
            expect(u instanceof User);
        })
    });

    it('should login a user', () => {
        const uri = `/rest/users/login`;
        spyOn($http, 'post').and.callThrough();

        $httpBackend.whenPOST(uri).respond(200, user);
        const promise = UserResource.login('mail', 'pw');
        $httpBackend.flush();

        expect(UserResource.$http.post).toHaveBeenCalledWith(uri, {
            email: 'mail',
            password: 'pw'
        });
        expect(promise.then).toBeDefined();
    });

    it('should delete a user', () => {
        const uri = `/rest/users/${user.id}`;
        spyOn($http, 'delete').and.callThrough();

        $httpBackend.whenDELETE(uri).respond(204, {});
        const promise = UserResource.remove(user);
        $httpBackend.flush();

        expect(UserResource.$http.delete).toHaveBeenCalledWith(uri, {});
        expect(promise.then).toBeDefined();
    });

    it('should promote a user', () => {
        const uri = `/rest/users/${user.id}/promote`;
        spyOn($http, 'put').and.callThrough();

        $httpBackend.whenPUT(uri).respond(200, ENTITIES.users[1]);
        const promise = UserResource.promote(user);
        $httpBackend.flush();

        expect(UserResource.$http.put).toHaveBeenCalledWith(uri, {});
        promise.then((u) => {
            expect(u instanceof User);
        })
    });

    it('should demote a user', () => {
        const uri = `/rest/users/${user.id}/demote`;
        spyOn($http, 'put').and.callThrough();

        $httpBackend.whenPUT(uri).respond(200, ENTITIES.users[1]);
        const promise = UserResource.demote(user);
        $httpBackend.flush();

        expect(UserResource.$http.put).toHaveBeenCalledWith(uri, {});
        promise.then((u) => {
            expect(u instanceof User);
        })
    })
});
