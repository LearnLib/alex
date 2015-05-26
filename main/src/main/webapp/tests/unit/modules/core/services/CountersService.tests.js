describe('CounterService', function(){

    var $httpBackend,
        paths,
        CounterService;

    var getAllRequestHandler,
        deleteRequestHandler,
        deleteSomeRequestHandler;

    var counters,
        projectId,
        url;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function(_$httpBackend_, _paths_, _CounterService_){
        $httpBackend = _$httpBackend_;
        paths = _paths_;
        CounterService = _CounterService_;

        projectId = 1;
        url = paths.api.URL + '/projects/' + projectId + '/counters';
        counters = TestDataProvider.counters;

        getAllRequestHandler.when('GET', url);
        deleteRequestHandler.when('DELETE', url);
        deleteSomeRequestHandler.when('DELETE', url);
    }))


});