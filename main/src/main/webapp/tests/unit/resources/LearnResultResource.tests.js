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
        const promise = LearnResultResource.removeMany(results);
        $httpBackend.flush();

        expect(LearnResultResource.$http.delete).toHaveBeenCalledWith(uri, {});
        expect(promise.then).toBeDefined();
    });
});