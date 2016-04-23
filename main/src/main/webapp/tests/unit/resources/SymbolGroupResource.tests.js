import {SymbolGroup} from '../../../src/js/entities/SymbolGroup';

describe('SymbolGroupResource', () => {
    let $http;
    let $httpBackend;
    let SymbolGroupResource;

    let uri;
    let project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$http_, _SymbolGroupResource_, _$httpBackend_) => {
        $http = _$http_;
        SymbolGroupResource = _SymbolGroupResource_;
        $httpBackend = _$httpBackend_;

        project = ENTITIES.projects[0];
        uri = `rest/projects/${project.id}/groups`;
    }));

    it('should correctly initialize the resource', () => {
        expect(SymbolGroupResource.$http).toEqual($http);
    });

    it('should get all groups without symbols and return instances of SymbolGroup', () => {
        spyOn(SymbolGroupResource.$http, 'get').and.callThrough();

        $httpBackend.whenGET(uri).respond(200, ENTITIES.groups);
        const promise = SymbolGroupResource.getAll(project.id);
        $httpBackend.flush();

        expect(SymbolGroupResource.$http.get).toHaveBeenCalledWith(uri);
        promise.then(groups => {
            groups.forEach(g => expect(g instanceof SymbolGroup).toBe(true));
        })
    });

    it('should get all groups with symbols and return instances of SymbolGroup', () => {
        spyOn(SymbolGroupResource.$http, 'get').and.callThrough();

        $httpBackend.whenGET(uri + '?embed=symbols').respond(200, ENTITIES.groups);
        const promise = SymbolGroupResource.getAll(project.id, true);
        $httpBackend.flush();

        expect(SymbolGroupResource.$http.get).toHaveBeenCalledWith(uri + '?embed=symbols');
        promise.then(groups => {
            groups.forEach(g => expect(g instanceof SymbolGroup).toBe(true));
        })
    });

    it('should create a group from a form model and return an instance of the created group', () => {
        const model = new SymbolGroup();
        spyOn(SymbolGroupResource.$http, 'post').and.callThrough();

        $httpBackend.whenPOST(uri).respond(201, ENTITIES.groups[0]);
        const promise = SymbolGroupResource.create(project.id, model);
        $httpBackend.flush();

        expect(SymbolGroupResource.$http.post).toHaveBeenCalledWith(uri, model);
        promise.then(group => {
            expect(group instanceof SymbolGroup).toBe(true);
        })
    });

    it('should update a group and return the instance of the updated SymbolGroup', () => {
        spyOn(SymbolGroupResource.$http, 'put').and.callThrough();

        const groupToUpdate = ENTITIES.groups[0];

        $httpBackend.whenPUT(uri + '/' + groupToUpdate.id).respond(200, groupToUpdate);
        const promise = SymbolGroupResource.update(groupToUpdate);
        $httpBackend.flush();

        expect(SymbolGroupResource.$http.put).toHaveBeenCalledWith(uri + '/' + groupToUpdate.id, groupToUpdate);
        promise.then(group => {
            expect(group instanceof SymbolGroup).toBe(true);
        })
    });

    it('should delete a group and return a promise', () => {
        spyOn(SymbolGroupResource.$http, 'delete').and.callThrough();

        const groupToDelete = ENTITIES.groups[0];

        $httpBackend.whenDELETE(uri + '/' + groupToDelete.id).respond(200, {});
        const promise = SymbolGroupResource.remove(groupToDelete);
        $httpBackend.flush();

        expect(SymbolGroupResource.$http.delete).toHaveBeenCalledWith(uri + '/' + groupToDelete.id);
        expect(promise.then).toBeDefined();
    });
});