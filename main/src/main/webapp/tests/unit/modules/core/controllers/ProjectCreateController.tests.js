describe('ProjectCreateController', function () {
    var $rootScope, $controller, $scope, $state, SessionService, Project, $httpBackend, ProjectMockData;
    var project;
    var createController;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        SessionService = $injector.get('SessionService');
        Project = $injector.get('Project');
        $httpBackend = $injector.get('$httpBackend');
        $controller = $injector.get('$controller');
        $state = $injector.get('$state');
        ProjectMockData = $injector.get('ProjectMockData');

        project = new Project('newProject', 'http://localhost');

        createController = function () {
            $controller('ProjectCreateController', {
                $scope: $scope
            });
        };

        $state.go('project.create');
        $rootScope.$digest();
    }));

    it('should have an empty project on instantiation', function () {
        createController();
        expect($scope.project instanceof Project);
        expect($scope.project.name).toBeNull();
        expect($scope.project.baseUrl).toBeNull();
    });

    it('should successfully create a new project and redirect to home', function () {
        createController();
        $scope.project.name = project.name;
        $scope.project.baseUrl = project.baseUrl;
        $scope.createProject();
        $httpBackend.flush();
        $rootScope.$digest();
        expect($state.current.name).toEqual('home');
    });

    it('should fail to create a new project', function () {
        createController();
        $scope.project.name = 'Project1';
        $scope.project.baseUrl = project.baseUrl;
        var name = $scope.project.name;
        var baseUrl = $scope.project.baseUrl;
        $scope.createProject();
        $httpBackend.flush();
        $rootScope.$digest();
        expect($state.current.name).toEqual('project.create');
        expect($scope.project.name).toEqual(name);
        expect($scope.project.baseUrl).toEqual(baseUrl);
    });
});