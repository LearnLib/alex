import {LearnResult} from '../../../src/js/entities/LearnResult';

describe('LearnResultResource', () => {
    let LearnResultResource, $http, $q, $httpBackend;
    let results, projectId = 1;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        LearnResultResource = $injector.get('LearnResultResource');
        $http = $injector.get('$http');
        $q = $injector.get('$q');
        $httpBackend = $injector.get('$httpBackend');

        results = ENTITIES.learnResults;
    }));

    it('should get all results', () => {
        const uri = `rest/projects/${projectId}/results?embed=steps`;
        spyOn($http, 'get').and.callThrough();

        $httpBackend.whenGET(uri).respond(200, results);
        const promise = LearnResultResource.getAll(projectId);
        $httpBackend.flush();

        expect(LearnResultResource.$http.get).toHaveBeenCalledWith(uri);
        promise.then((results) => {
            results.forEach(r => {
                expect(r instanceof LearnResult);
            })
        })
    });

    it('should get a single result', () => {
        const uri = `rest/projects/${projectId}/results/0?embed=steps`;
        spyOn($http, 'get').and.callThrough();

        $httpBackend.whenGET(uri).respond(200, results[0]);
        const promise = LearnResultResource.get(projectId, 0);
        $httpBackend.flush();

        expect(LearnResultResource.$http.get).toHaveBeenCalledWith(uri);
        promise.then((result) => {
            expect(result instanceof LearnResult);
        })
    });

    it('should remove a single result', () => {
        const uri = `rest/projects/${results[0].project}/results/${results[0].testNo}`;
        spyOn($http, 'delete').and.callThrough();

        $httpBackend.whenDELETE(uri).respond(200, null);
        const promise = LearnResultResource.remove(results[0]);
        $httpBackend.flush();

        expect(LearnResultResource.$http.delete).toHaveBeenCalledWith(uri, {});
        expect(promise.then).toBeDefined();
    });

    it('should remove many results', () => {
        const testNos = results.map(r => r.testNo).join(',');
        const uri = `rest/projects/${results[0].project}/results/${testNos}`;
        spyOn($http, 'delete').and.callThrough();

        $httpBackend.whenDELETE(uri).respond(200, null);
        const promise = LearnResultResource.remove(results);
        $httpBackend.flush();

        expect(LearnResultResource.$http.delete).toHaveBeenCalledWith(uri, {});
        expect(promise.then).toBeDefined();
    });

    //it('should change the password of a user', () => {
    //    const uri = `rest/users/${user.id}/password`;
    //    spyOn($http, 'put').and.callThrough();
    //
    //    UserResource.changePassword(user, 'pw1', 'pw2');
    //    expect($http.put).toHaveBeenCalledWith(uri, {oldPassword: 'pw1', newPassword: 'pw2'})
    //});
    //
    //it('should change the email of a user', () => {
    //    const uri = `rest/users/${user.id}/email`;
    //    spyOn($http, 'put').and.callThrough();
    //
    //    UserResource.changeEmail(user, 'mail');
    //    expect($http.put).toHaveBeenCalledWith(uri, {email: 'mail'})
    //});
    //
    //it('should get a single user by its it and return an instance of the user', () => {
    //    const uri = `rest/users/${user.id}`;
    //    spyOn($http, 'get').and.callThrough();
    //
    //    $httpBackend.whenGET(uri).respond(200, ENTITIES.users[0]);
    //    const promise = UserResource.get(user.id);
    //    $httpBackend.flush();
    //
    //    expect(UserResource.$http.get).toHaveBeenCalledWith(uri);
    //    promise.then((user) => {
    //        expect(user instanceof User);
    //    })
    //});
    //
    //it('should get all users', () => {
    //    const uri = `rest/users`;
    //    spyOn($http, 'get').and.callThrough();
    //
    //    $httpBackend.whenGET(uri).respond(200, ENTITIES.users);
    //    const promise = UserResource.getAll();
    //    $httpBackend.flush();
    //
    //    expect(UserResource.$http.get).toHaveBeenCalledWith(uri);
    //    promise.then((users) => {
    //        users.forEach(u => expect(u instanceof User));
    //    })
    //});
    //
    //it('should create a new user', () => {
    //    const uri = `rest/users`;
    //    const user = new UserFormModel('mail', 'pw');
    //    spyOn($http, 'post').and.callThrough();
    //
    //    $httpBackend.whenPOST(uri).respond(201, ENTITIES.users[0]);
    //    const promise = UserResource.create(user);
    //    $httpBackend.flush();
    //
    //    expect(UserResource.$http.post).toHaveBeenCalledWith(uri, user);
    //    promise.then((u) => {
    //        expect(u instanceof User);
    //    })
    //});
    //
    //it('should login a user', () => {
    //    const uri = `rest/users/login`;
    //    spyOn($http, 'post').and.callThrough();
    //
    //    $httpBackend.whenPOST(uri).respond(200, user);
    //    const promise = UserResource.login(user);
    //    $httpBackend.flush();
    //
    //    expect(UserResource.$http.post).toHaveBeenCalledWith(uri, user);
    //    expect(promise.then).toBeDefined();
    //});
    //
    //it('should delete a user', () => {
    //    const uri = `rest/users/${user.id}`;
    //    spyOn($http, 'delete').and.callThrough();
    //
    //    $httpBackend.whenDELETE(uri).respond(204, {});
    //    const promise = UserResource.remove(user);
    //    $httpBackend.flush();
    //
    //    expect(UserResource.$http.delete).toHaveBeenCalledWith(uri, {});
    //    expect(promise.then).toBeDefined();
    //});
    //
    //it('should promote a user', () => {
    //    const uri = `rest/users/${user.id}/promote`;
    //    spyOn($http, 'put').and.callThrough();
    //
    //    $httpBackend.whenPUT(uri).respond(200, ENTITIES.users[1]);
    //    const promise = UserResource.promote(user);
    //    $httpBackend.flush();
    //
    //    expect(UserResource.$http.put).toHaveBeenCalledWith(uri, {});
    //    promise.then((u) => {
    //        expect(u instanceof User);
    //    })
    //});
    //
    //it('should demote a user', () => {
    //    const uri = `rest/users/${user.id}/demote`;
    //    spyOn($http, 'put').and.callThrough();
    //
    //    $httpBackend.whenPUT(uri).respond(200, ENTITIES.users[1]);
    //    const promise = UserResource.demote(user);
    //    $httpBackend.flush();
    //
    //    expect(UserResource.$http.put).toHaveBeenCalledWith(uri, {});
    //    promise.then((u) => {
    //        expect(u instanceof User);
    //    })
    //})
});