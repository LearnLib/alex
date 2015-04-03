(function(){
    'use strict';

    describe('SymbolsTrashController', function(){
        var $rootScope, Symbol, SessionService, $httpBackend, paths;

        var recoverRequestHandler, recoverSomeRequestHandler;

        beforeEach(angular.mock.module('weblearner'));
        beforeEach(angular.mock.module('weblearner.controller'));

        beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Symbol_, _SessionService_, _$httpBackend_, _paths_) {
            $rootScope = _$rootScope_;
            Symbol = _Symbol_;
            SessionService = _SessionService_;
            $httpBackend = _$httpBackend_;
            paths = _paths_;

            // handler for api requests
            recoverRequestHandler = $httpBackend.when(paths.api.URL + '/projects/1/symbols/1/show');
            recoverSomeRequestHandler = $httpBackend.when(paths.api.URL + '/projects/1/symbols/batch/1,2/show');
        }));
    })
}());