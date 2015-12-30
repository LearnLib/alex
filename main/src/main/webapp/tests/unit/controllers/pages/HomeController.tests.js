describe('HomeController', () => {
    let HomeController;
    let $state;
    let SessionService;
    let scope;
    let Project;
    let User;
    let $controller;

    let project;
    let user;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$controller_, $rootScope, _$state_, _SessionService_, _Project_, _User_) => {
        $state = _$state_;
        SessionService = _SessionService_;
        scope = $rootScope.$new();
        Project = _Project_;
        User = _User_;
        $controller = _$controller_;

        project = new Project(ENTITIES.projects[0]);
        user = new User(ENTITIES.users[0]);

        spyOn($state, 'go').and.callThrough();
    }));

    function createController() {
        HomeController = $controller('HomeController', {
            $state: $state,
            SessionService: SessionService
        });
    }

    afterEach(() => {
        sessionStorage.removeItem('project');
        sessionStorage.removeItem('user');
    });

    it('should stay home if no user is logged in and no project is open', () => {
        createController();

        $state.go('home');
        scope.$digest();

        expect(HomeController.user).toBeNull();
        expect(HomeController.project).toBeNull();
        expect($state.current.name).toEqual('home');
    });

    it('should stay home if a project is open but no user is logged in', () => {
        SessionService.saveProject(project);
        createController();

        $state.go('home');
        scope.$digest();

        expect(HomeController.user).toBeNull();
        expect(HomeController.project).toEqual(project);
        expect($state.current.name).toEqual('home');
    });

    it('should redirect to the project list if a user is logged in but no project is open', () => {
        SessionService.saveUser(user);
        createController();

        $state.go('home');
        scope.$digest();

        expect(HomeController.user).toEqual(user);
        expect(HomeController.project).toBeNull();
        expect($state.go).toHaveBeenCalledWith('projects');
    });

    it('should redirect to the project dashboard if a user is logged in and a project is open', () => {
        SessionService.saveUser(user);
        SessionService.saveProject(project);
        createController();

        $state.go('home');
        scope.$digest();

        expect(HomeController.user).toEqual(user);
        expect(HomeController.project).toEqual(project);
        expect($state.go).toHaveBeenCalledWith('projectsDashboard');
    });
});