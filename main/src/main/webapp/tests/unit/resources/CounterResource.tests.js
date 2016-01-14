import Counter from '../../../app/modules/entities/Counter';

describe('CounterResource', () => {
    let $http;
    let $httpBackend;
    let CounterResource;

    let project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$http_, _CounterResource_, _$httpBackend_) => {
        $http = _$http_;
        CounterResource = _CounterResource_;
        $httpBackend = _$httpBackend_;

        project = ENTITIES.projects[0];
    }));

    it('should correctly initialize the resource', () => {
        expect(CounterResource.$http).toEqual($http);
    });

    it('should get all counters and return a list of counter instances', () => {
        spyOn(CounterResource.$http, 'get').and.callThrough();

        $httpBackend.whenGET(`/rest/projects/${project.id}/counters`).respond(200, ENTITIES.counters);
        const promise = CounterResource.getAll(project.id);
        $httpBackend.flush();

        expect(CounterResource.$http.get).toHaveBeenCalledWith(`/rest/projects/${project.id}/counters`);
        promise.then((counters) => {
            counters.forEach(c => expect(c instanceof Counter).toBeTruthy());
        })
    });

    it('should remove a single counter and return a promise', () => {
        spyOn(CounterResource.$http, 'delete').and.callThrough();
        const counter = ENTITIES.counters[0];

        $httpBackend.whenDELETE(`/rest/projects/${project.id}/counters/${counter.name}`).respond(200, {});
        const promise = CounterResource.remove(project.id, counter);
        $httpBackend.flush();

        expect(CounterResource.$http.delete).toHaveBeenCalledWith(`/rest/projects/${project.id}/counters/${counter.name}`);
        expect(promise.then).toBeDefined();
        expect(promise.catch).toBeDefined();
    });

    it('should remove many counters and return a promise', () => {
        spyOn(CounterResource.$http, 'delete').and.callThrough();
        const counters = ENTITIES.counters;
        const names = counters.map(c => c.name).join(',');

        const uri = `/rest/projects/${project.id}/counters/batch/${names}`;

        $httpBackend.whenDELETE(uri).respond(200, {});
        const promise = CounterResource.removeMany(project.id, counters);
        $httpBackend.flush();

        expect(CounterResource.$http.delete).toHaveBeenCalledWith(uri);
        expect(promise.then).toBeDefined();
        expect(promise.catch).toBeDefined();
    });
});