//(function(){
//    'use strict';
//
//    describe('ProjectSettingsController', function(){
//        var $rootScope, $scope, $state, SessionService, Project, $httpBackend, paths;
//
//        var createController;
//
//        var project;
//
//        var updateProjectRequestHandler, deleteProjectRequestHandler, learnerActiveRequestHandler;
//
//        beforeEach(angular.mock.module('ALEX'));
//        beforeEach(angular.mock.module('ALEX.controller'));
//
//        beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _$state_, _Project_, _SessionService_, _$httpBackend_, _paths_) {
//            $rootScope = _$rootScope_;
//            $scope = _$rootScope_.$new();
//            $state = _$state_;
//            SessionService = _SessionService_;
//            Project = _Project_;
//            $httpBackend = _$httpBackend_;
//            paths = _paths_;
//
//            project = new Project('name', 'http://bla');
//            project.id = 1;
//
//            updateProjectRequestHandler = $httpBackend
//                .when('PUT', paths.api.URL + '/projects/1');
//
//            deleteProjectRequestHandler = $httpBackend
//                .when('DELETE', paths.api.URL + '/projects');
//
//            learnerActiveRequestHandler = $httpBackend
//                .when('GET', paths.api.URL + '/learner/active');
//
//            createController = function () {
//                return _$controller_('ProjectSettingsController', {
//                    $scope: $scope
//                });
//            };
//        }));
//
//        beforeEach(function(){
//            SessionService.project.save(project)
//        });
//
//        afterEach(function(){
//            SessionService.project.remove();
//        });
//
//        it('should successfully update a project and save it in the session', function(){
//            createController();
//
//            $scope.project.name = 'newName';
//
//            updateProjectRequestHandler.respond(200, {id: 1, name: 'newName', url: 'http://bla'});
//            learnerActiveRequestHandler.respond(400, {});
//
//            $httpBackend.expectGET(paths.api.URL + '/learner/active');
//            $httpBackend.expectPUT(paths.api.URL + '/projects/' + $scope.project.id, $scope.project);
//            $scope.updateProject();
//            $httpBackend.flush();
//
//            expect($scope.project.name).toEqual('newName');
//            expect(SessionService.project.get().name).toEqual('newName');
//
//            $scope.resetForm();
//
//            expect($scope.project.name).toEqual('newName');
//        });
//
//        it('should redirect to project if learner is active with the current project', function(){
//
//            learnerActiveRequestHandler.respond(200, {
//                active: true,
//                project: 1
//            });
//
//            $httpBackend.expectGET(paths.api.URL + '/learner/active');
//            createController();
//            $httpBackend.flush();
//
//            expect($state.is('project')).toBe(true)
//        });
//
//        it('should delete a project and redirect to home', function(){
//            // TODO
//        });
//
//        it('should reset a project in scope', function(){
//            createController();
//
//            var p = angular.copy($scope.project);
//
//            $scope.project.name = 'something other';
//            $scope.resetForm();
//
//            expect($scope.project).toEqual(p);
//        });
//    });
//}());