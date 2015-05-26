//(function () {
//    'use strict';
//
//    describe('SymbolsTrashController', function () {
//        var $rootScope, $scope, Symbol, SessionService, $httpBackend, paths, _;
//        var createController;
//        var getSymbolsRequestHandler, recoverRequestHandler, recoverSomeRequestHandler;
//
//        // dummies
//        var symbols = [];
//
//        beforeEach(angular.mock.module('ALEX'));
//        beforeEach(angular.mock.module('ALEX.controller'));
//
//        beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Symbol_, _SessionService_, _$httpBackend_, _paths_, ___) {
//            $rootScope = _$rootScope_;
//            Symbol = _Symbol_;
//            SessionService = _SessionService_;
//            $httpBackend = _$httpBackend_;
//            paths = _paths_;
//            _ = ___;
//
//            // handler for api requests
//            getSymbolsRequestHandler = $httpBackend.when('GET', paths.api.URL + '/projects/1/symbols?visibility=hidden');
//            recoverRequestHandler = $httpBackend.when('POST', paths.api.URL + '/projects/1/symbols/1/show');
//            recoverSomeRequestHandler = $httpBackend.when('POST', paths.api.URL + '/projects/1/symbols/batch/1,2/show');
//
//            // dummy symbols
//            symbols = [];
//            for (var i = 0; i < 3; i++) {
//                var s = new Symbol('name' + i, 'abbreviation' + i);
//                s.id = i + 1;
//                s.project = 1;
//                s.hidden = true;
//                symbols.push(s);
//            }
//
//            // new controller for each case
//            createController = function () {
//                $scope = _$rootScope_.$new();
//                return _$controller_('SymbolsTrashController', {
//                    $scope: $scope
//                });
//            };
//        }));
//
//        beforeEach(function () {
//            SessionService.project.save({id: 1});
//        });
//
//        afterEach(function () {
//            SessionService.project.remove();
//        });
//
//        function init() {
//            getSymbolsRequestHandler.respond(200, symbols);
//
//            $httpBackend.expectGET(paths.api.URL + '/projects/1/symbols?visibility=hidden');
//            createController();
//            $httpBackend.flush();
//        }
//
//        it('should load hidden symbols into scope on init', function () {
//            init();
//
//            expect($scope.symbols.length).toBe(3);
//            expect($scope.selectedSymbols.length).toBe(0)
//        });
//
//        it('should recover a single symbol and remove it from scope on success', function () {
//            init();
//
//            var s = symbols[0];
//            s.hidden = false;
//
//            recoverRequestHandler.respond(200, s);
//
//            expect(_.findIndex($scope.symbols, {id: symbols[0].id}) > -1).toBe(true);
//
//            $httpBackend.expectPOST(paths.api.URL + '/projects/1/symbols/1/show');
//            $scope.recoverSymbol(symbols[0]);
//            $httpBackend.flush();
//
//            expect(_.findIndex($scope.symbols, {id: symbols[0].id}) > -1).toBe(false);
//        });
//
//        it('should not recover a single symbol and remove it from scope on fail', function () {
//            init();
//
//            recoverRequestHandler.respond(400, {data: {message: 'error'}});
//            expect(_.findIndex($scope.symbols, {id: symbols[0].id}) > -1).toBe(true);
//            $httpBackend.expectPOST(paths.api.URL + '/projects/1/symbols/1/show');
//            $scope.recoverSymbol(symbols[0]);
//            $httpBackend.flush();
//            expect(_.findIndex($scope.symbols, {id: symbols[0].id}) > -1).toBe(true);
//        });
//
//        it('should recover multiple selected symbols and remove them from the scope on success', function () {
//            init();
//
//            var s1 = symbols[0];
//            s1.hidden = false;
//            var s2 = symbols[1];
//            s2.hidden = false;
//
//            recoverSomeRequestHandler.respond(200, [s1, s2]);
//
//            $scope.selectedSymbols = [$scope.symbols[0], $scope.symbols[1]];
//
//            $httpBackend.expectPOST(paths.api.URL + '/projects/1/symbols/batch/1,2/show');
//            $scope.recoverSelectedSymbols();
//            $httpBackend.flush();
//
//            expect($scope.symbols.length).toBe(1);
//            expect($scope.selectedSymbols.length).toBe(0);
//
//            _.forEach([s1, s2], function (s) {
//                expect(_.findIndex($scope.symbols, {id: s.id}) === -1).toBe(true);
//            })
//        });
//
//        it('should NOT recover multiple selected symbols and remove them from the scope on fail', function () {
//            init();
//
//            var s1 = symbols[0];
//            s1.hidden = false;
//            var s2 = symbols[1];
//            s2.hidden = false;
//
//            recoverSomeRequestHandler.respond(400, {});
//
//            $scope.selectedSymbols = [$scope.symbols[0], $scope.symbols[1]];
//
//            $httpBackend.expectPOST(paths.api.URL + '/projects/1/symbols/batch/1,2/show');
//            $scope.recoverSelectedSymbols();
//            $httpBackend.flush();
//
//            expect($scope.symbols.length).toBe(3);
//            expect($scope.selectedSymbols.length).toBe(2);
//
//            _.forEach([s1, s2], function (s) {
//                expect(_.findIndex($scope.symbols, {id: s.id}) === -1).toBe(false);
//            })
//        });
//
//        it('should nothing happen on multiple recover when no symbol is selected', function () {
//            init();
//            $scope.recoverSelectedSymbols();
//            expect($scope.symbols.length).toBe(3);
//            expect($scope.selectedSymbols.length).toBe(0);
//        })
//    })
//}());