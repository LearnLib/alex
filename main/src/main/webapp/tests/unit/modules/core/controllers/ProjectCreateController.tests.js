(function () {
    'use strict';

    describe('ProjectCreateController', function () {
        var $rootScope, $scope, $state, SessionService, Project, $httpBackend, paths;
        var createController;
        var createProjectRequestHandler;
        var project;

        beforeEach(angular.mock.module('ALEX'));
        beforeEach(angular.mock.module('ALEX.controller'));

        beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Project_, _SessionService_, _$httpBackend_, _paths_, _$state_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            SessionService = _SessionService_;
            Project = _Project_;
            $httpBackend = _$httpBackend_;
            $state = _$state_;
            paths = _paths_;

            project = new Project('name', 'http://bla');

            createProjectRequestHandler = $httpBackend
                .when('POST', paths.api.URL + '/projects');

            createController = function () {
                return _$controller_('ProjectCreateController', {
                    $scope: $scope
                });
            };
        }));

        it('should successfully create a new project and redirect to home', function(){
            createController();

            $scope.project = project;
            expect($scope.project.id).not.toBeDefined();

            createProjectRequestHandler.respond(201, {});

            $httpBackend.expectPOST(paths.api.URL + '/projects', $scope.project);
            $scope.createProject();
            $httpBackend.flush();

            var wasRedirected = $state.is('home');
            expect(wasRedirected).toBe(true);
        });

        it('should fail to create a new project', function(){
            createController();

            $scope.project = project;
            expect($scope.project.id).not.toBeDefined();

            createProjectRequestHandler.respond(404, {});

            $httpBackend.expectPOST(paths.api.URL + '/projects', $scope.project);
            $scope.createProject();
            $httpBackend.flush();
        })
    });
}());