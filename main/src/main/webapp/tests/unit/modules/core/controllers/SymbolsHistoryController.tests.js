(function () {
    'use strict';

    describe('SymbolsHistoryController', function () {
        var $rootScope, $scope, Symbol, SessionService, $httpBackend, paths, _, $stateParams;
        var createController;

        var getRevisionsRequestHandler, updateRequestHandler;

        var symbols = [];

        beforeEach(angular.mock.module('ALEX'));
        beforeEach(angular.mock.module('ALEX.controller'));

        beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Symbol_, _SessionService_, _$httpBackend_, _paths_, ___, _$stateParams_) {
            $rootScope = _$rootScope_;
            Symbol = _Symbol_;
            SessionService = _SessionService_;
            $httpBackend = _$httpBackend_;
            paths = _paths_;
            _ = ___;
            $stateParams = _$stateParams_;

            // handler for api requests
            getRevisionsRequestHandler = $httpBackend.when('GET', paths.api.URL + '/projects/1/symbols/1/complete');
            updateRequestHandler = $httpBackend.when('PUT', paths.api.URL + '/projects/1/symbols/1');

            // dummy symbols
            var s1 = new Symbol('test', 't');
            var s2 = new Symbol('test', 't');
            var s3 = new Symbol('test', 't');

            s1.id = 1;
            s2.id = 1;
            s3.id = 1;

            s1.revision = 3;
            s2.revision = 2;
            s3.revision = 1;

            symbols = [];
            symbols.push(s1);
            symbols.push(s2);
            symbols.push(s3);

            $stateParams.symbolId = 1;

            // new controller for each case
            createController = function () {
                $scope = _$rootScope_.$new();
                return _$controller_('SymbolsHistoryController', {
                    $scope: $scope,
                    $stateParams: $stateParams
                });
            };
        }));

        beforeEach(function () {
            SessionService.project.save({id: 1});
        });

        afterEach(function () {
            SessionService.project.remove();
        });

        function init(){
            getRevisionsRequestHandler.respond('200', symbols);

            $httpBackend.expectGET(paths.api.URL + '/projects/1/symbols/1/complete');
            createController();
            $httpBackend.flush();
        }

        it('should load all revisions of a visible symbol on init', function(){
            init();

            expect($scope.revisions.length).toBe(3);
            expect($scope.latestRevision).not.toBeNull();
            expect($scope.latestRevision.revision).toBe(3);
        });

        it('should restore the revision of a symbol on SUCCESS', function(){

        });

        it('should NOT restore the revision of a symbol on FAILURE', function(){

        });
    });
}());