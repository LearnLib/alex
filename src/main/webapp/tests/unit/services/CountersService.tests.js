(function () {
    'use strict';

    describe('CountersService', function () {
        var CountersService;
        var $httpBackend;
        var paths;

        var getCountersRequestHandler;
        var deleteCounterRequestHandler;
        var deleteCountersRequestHandler;

        var counters = [
            {name: 'a', value: 0, project: 1},
            {name: 'b', value: 0, project: 1}
        ];

        beforeEach(angular.mock.module('ALEX'));
        beforeEach(angular.mock.module('ALEX.services'));

        beforeEach(angular.mock.inject(function (_CountersService_, _$httpBackend_, _paths_) {
            CountersService = _CountersService_;
            $httpBackend = _$httpBackend_;
            paths = _paths_;

            getCountersRequestHandler = $httpBackend
                .when('GET', paths.api.URL + '/projects/1/counters');

            deleteCounterRequestHandler = $httpBackend
                .when('DELETE', paths.api.URL + '/projects/1/counters/a');

            deleteCountersRequestHandler = $httpBackend
                .when('DELETE', paths.api.URL + '/projects/1/counters/batch/a,b');
        }));

        it('should get all counters', function(){
            getCountersRequestHandler.respond(200, counters);

            $httpBackend.expectGET(paths.api.URL + '/projects/1/counters');
            expect(CountersService.getAll(1).then).toBeDefined();
            $httpBackend.flush();
        });

        it('should get all counters', function(){
            deleteCounterRequestHandler.respond(200, {});

            $httpBackend.expectDELETE(paths.api.URL + '/projects/1/counters/a');
            expect(CountersService.delete(1, 'a').then).toBeDefined();
            $httpBackend.flush();
        });

        it('should get all counters', function(){
            deleteCountersRequestHandler.respond(200, {});

            $httpBackend.expectDELETE(paths.api.URL + '/projects/1/counters/batch/a,b');
            expect(CountersService.deleteSome(1, ['a', 'b']).then).toBeDefined();
            $httpBackend.flush();
        })
    });
}());