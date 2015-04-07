(function () {
    'use strict';

    describe('SymbolsExportController', function () {
        var $rootScope, $scope, Symbol, SessionService, $httpBackend, paths, _;
        var createController;

        beforeEach(angular.mock.module('weblearner'));
        beforeEach(angular.mock.module('weblearner.controller'));

        beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Symbol_, _SessionService_, _$httpBackend_, _paths_, ___) {
            $rootScope = _$rootScope_;
            Symbol = _Symbol_;
            SessionService = _SessionService_;
            $httpBackend = _$httpBackend_;
            paths = _paths_;
            _ = ___;

            // handler for api requests

            // dummy symbols

            // new controller for each case
            createController = function () {
                $scope = _$rootScope_.$new();
                return _$controller_('SymbolsTrashController', {
                    $scope: $scope
                });
            };
        }));

        beforeEach(function () {
            SessionService.project.save({id: 1});
        });

        afterEach(function () {
            SessionService.project.remove();
        });

        it('should load all symbol groups on init and extract all symbols and save both into scope', function () {
        });

        it('should correctly prepare selected symbols for download', function () {
        });
    })
}());