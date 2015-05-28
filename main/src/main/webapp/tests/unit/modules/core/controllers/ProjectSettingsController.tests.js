describe('ProjectSettingsController', function () {
    var $rootScope,
        $scope,
        $state,
        SessionService,
        Project,
        $httpBackend,
        paths;

    var updateProjectRequestHandler,
        deleteProjectRequestHandler,
        learnerActiveRequestHandler;

    var createController;

    var project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _$state_, _Project_, _SessionService_,
                                             _$httpBackend_, _paths_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $state = _$state_;
        SessionService = _SessionService_;
        Project = _Project_;
        $httpBackend = _$httpBackend_;
        paths = _paths_;

        project = Project.build(TestDataProvider.projects[0]);

        updateProjectRequestHandler = $httpBackend
            .when('PUT', paths.api.URL + '/projects/1');

        deleteProjectRequestHandler = $httpBackend
            .when('DELETE', paths.api.URL + '/projects');

        learnerActiveRequestHandler = $httpBackend
            .when('GET', paths.api.URL + '/learner/active');

        createController = function () {
            _$controller_('ProjectSettingsController', {
                $scope: $scope
            });
        };
    }));

    beforeEach(function () {
        SessionService.project.save(project)
    });

    afterEach(function () {
        SessionService.project.remove();
    });

    it('should successfully update a project and save it in the session', function () {

    });

    it('should redirect to project if learner is active with the current project', function () {
        learnerActiveRequestHandler.respond(200, {active: true, project: 1});
        $httpBackend.expectGET(paths.api.URL + '/learner/active');
        createController();
        $httpBackend.flush();
        $rootScope.$digest();
        expect($state.current.name).toEqual('project');
    });

    it('should delete a project and redirect to home', function () {
        deleteProjectRequestHandler.respond(204, {});
        $httpBackend.expectDELETE(paths.api.URL + '/')
    });
});