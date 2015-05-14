(function(){

    describe('HomeController', function(){
        var $scope, paths, Session, $state, $httpBackend, Project;
        var createController;
        var getAllProjectsRequestHandler;
        var projects;

        beforeEach(angular.mock.module('ALEX'));
        beforeEach(angular.mock.module('ALEX.core'));
        beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _SessionService_, _Project_, _ProjectResource_, _$state_, _$httpBackend_, _paths_) {
            $scope = _$rootScope_.$new();
            Session = _SessionService_;
            $state = _$state_;
            $httpBackend = _$httpBackend_;
            paths = _paths_;
            Project = _Project_;

            getAllProjectsRequestHandler = $httpBackend
                .when('GET', paths.api.URL + '/projects');

            projects = [
                new Project('p1', 'http://p1'),
                new Project('p2', 'http://p2')
            ];

            createController = function (){
                _$controller_('HomeController', {
                    $scope: $scope
                });
            };

            createController();
        }));

        it('should load projects from the server on init', function(){
            getAllProjectsRequestHandler.respond(200, projects);
            $httpBackend.expectGET(paths.api.URL + '/projects');
            $httpBackend.flush();

            expect($scope.projects.length).toBe(2);
        });

        it('should save a project in sessionStorage', function(){
            $scope.openProject(projects[0]);
            expect(Session.project.get()).not.toBeNull();
            Session.project.remove();
        });
    });
}());