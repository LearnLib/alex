//(function () {
//    'use strict';
//
//    describe('CountersController', function () {
//        var $scope, SessionService, Project, $httpBackend, paths, createController, project, _;
//
//        // request handles
//        var getCountersRequestHandler;
//        var deleteCounterRequestHandler;
//        var deleteCountersRequestHandler;
//
//        // dummy counters for sending on requests
//        var counters = [
//            {name: 'a', value: 0, project: 1},
//            {name: 'b', value: 0, project: 1}
//        ];
//
//        beforeEach(angular.mock.module('ALEX'));
//        beforeEach(angular.mock.module('ALEX.controller'));
//
//        beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Project_, _SessionService_, _$httpBackend_, _paths_, ___) {
//            $scope = _$rootScope_.$new();
//            SessionService = _SessionService_;
//            Project = _Project_;
//            $httpBackend = _$httpBackend_;
//            paths = _paths_;
//            _ = ___;
//
//            // dummy project for session
//            project = new Project('name', 'host');
//            project.id = 1;
//
//            getCountersRequestHandler = $httpBackend
//                .when('GET', paths.api.URL + '/projects/' + project.id + '/counters');
//
//            deleteCounterRequestHandler = $httpBackend
//                .when('DELETE', paths.api.URL + '/projects/' + project.id + '/counters/a');
//
//            deleteCountersRequestHandler = $httpBackend
//                .when('DELETE', paths.api.URL + '/projects/' + project.id + '/counters/batch/a,b');
//
//            createController = function () {
//                return _$controller_('CountersController', {
//                    $scope: $scope
//                });
//            }
//        }));
//
//        beforeEach(function () {
//            SessionService.project.save(project);
//        });
//
//        afterEach(function () {
//            SessionService.project.remove();
//        });
//
//        function initController() {
//            getCountersRequestHandler.respond(201, counters);
//
//            $httpBackend.expectGET(paths.api.URL + '/projects/' + project.id + '/counters');
//            createController();
//            $httpBackend.flush();
//        }
//
//        it('should init the controller and load counters from the server', function () {
//            initController();
//            expect($scope.counters.length).toBe(counters.length)
//        });
//
//        it('should remove a single counter on delete success', function () {
//            initController();
//
//            deleteCounterRequestHandler.respond(200, {});
//
//            $httpBackend.expectDELETE(paths.api.URL + '/projects/' + project.id + '/counters/a');
//            $scope.deleteCounter(counters[0]);
//            $httpBackend.flush();
//
//            expect($scope.counters.length).toBe(1);
//            expect(_.find($scope.counters, {name: counters[0].name})).not.toBeDefined();
//        });
//
//        it('should not remove a single counter on delete fail', function () {
//            initController();
//
//            deleteCounterRequestHandler.respond(404, {});
//
//            $httpBackend.expectDELETE(paths.api.URL + '/projects/' + project.id + '/counters/a');
//            $scope.deleteCounter(counters[0]);
//            $httpBackend.flush();
//
//            expect($scope.counters.length).toBe(2);
//        });
//
//        it('should remove multiple selected counters on delete success', function () {
//            initController();
//
//            deleteCountersRequestHandler.respond(200, {});
//            $scope.selectedCounters = counters;
//
//            $httpBackend.expectDELETE(paths.api.URL + '/projects/' + project.id + '/counters/batch/a,b');
//            $scope.deleteSelectedCounters(counters[0]);
//            $httpBackend.flush();
//
//            expect($scope.counters.length).toBe(0);
//        });
//
//        it('should not remove multiple selected counters on delete fail', function () {
//            initController();
//
//            deleteCountersRequestHandler.respond(404, {});
//            $scope.selectedCounters = counters;
//
//            $httpBackend.expectDELETE(paths.api.URL + '/projects/' + project.id + '/counters/batch/a,b');
//            $scope.deleteSelectedCounters(counters[0]);
//            $httpBackend.flush();
//
//            expect($scope.counters.length).toBe(2);
//        });
//    })
//}());