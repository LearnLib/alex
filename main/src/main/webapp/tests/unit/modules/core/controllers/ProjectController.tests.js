describe('ProjectController', function () {
    var $rootScope, $scope, $controller, SessionService, ProjectMockData, Project;
    var project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        SessionService = $injector.get('SessionService');
        ProjectMockData = $injector.get('ProjectMockData');
        Project = $injector.get('Project');

        project = Project.build(ProjectMockData.getById(1));
    }));

    beforeEach(function () {
        SessionService.project.save(project);
    });

    afterEach(function () {
        SessionService.project.remove();
    });

    it('should load the project from the session storage into the scope', function () {
        $scope = $rootScope.$new();
        $controller('ProjectController', {
            $scope: $scope
        });
        expect($scope.project).toEqual(project);
    })
});