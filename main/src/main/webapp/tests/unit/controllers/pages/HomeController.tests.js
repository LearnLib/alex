(function(){
    'use strict';

    describe('HomeController', function(){
        var scope;
        var Session;
        var $state;

        var projects = [];

        beforeEach(angular.mock.module('ALEX'));
        beforeEach(angular.mock.module('ALEX.controller'));
        beforeEach(angular.mock.module('ALEX.services'));

        beforeEach(angular.mock.inject(function($rootScope, $controller, Project, SessionService, _$state_) {
            scope = $rootScope.$new();
            Session = SessionService;
            $state = _$state_;

            projects.push(new Project('test', 'http://asdasd'));
            projects.push(new Project('tests', 'http://wqeqweqweqwe'));

            spyOn(Project.Resource, 'all').and.callFake(function() {
                return {
                    then: function(callback) {callback(projects)}
                };
            });

            $controller('HomeController', {
                $scope: scope
            });
        }));

        it('should load projects from the server on init', function(){
            expect(Session.project.get()).toBeNull();
            expect(scope.projects).toEqual(projects);
        });

        it('should save a project in sessionStorage and redirect to project', function(){
            scope.openProject(projects[0]);
            expect(Session.project.get()).not.toBeNull();
            Session.project.remove();
        });
    });
}());