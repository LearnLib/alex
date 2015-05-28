describe('ProjectCreateController', function () {
    var $rootScope,
        $scope,
        $state,
        SessionService,
        Project,
        $httpBackend,
        paths;

    var createProjectRequestHandler;
    var project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Project_, _SessionService_, _$httpBackend_,
                                             _paths_, _$state_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        SessionService = _SessionService_;
        Project = _Project_;
        $httpBackend = _$httpBackend_;
        $state = _$state_;
        paths = _paths_;

        project = new Project('test', 'http://localhost');
        createProjectRequestHandler = $httpBackend.when('POST', paths.api.URL + '/projects');

        _$controller_('ProjectCreateController', {
            $scope: $scope
        });
    }));

    it('should successfully create a new project and redirect to home', function () {
        createProjectRequestHandler.respond(201, {});
        $httpBackend.expectPOST(paths.api.URL + '/projects');

        $scope.project = project;
        $scope.createProject();
        $rootScope.$digest();
        expect($state.current.name).toEqual('home');
        $httpBackend.flush();
    });

    it('should fail to create a new project', function () {

    });
});