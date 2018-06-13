import {Project} from '../../../../src/js/entities/project';
import {User} from '../../../../src/js/entities/user';

describe('RootViewComponent', () => {
    let controller;
    let $state;
    let SessionService;
    let scope;
    let $controller;
    let $compile;
    let $rootScope;

    let project;
    let user;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$controller_, _$rootScope_, _$compile_, _$state_, _SessionService_) => {
        $state = _$state_;
        SessionService = _SessionService_;
        scope = _$rootScope_.$new();
        $controller = _$controller_;
        $compile = _$compile_;
        $rootScope = _$rootScope_

        project = new Project(ENTITIES.projects[0]);
        user = new User(ENTITIES.users[0]);

        spyOn($state, 'go').and.callThrough();
    }));

    function createController() {
        const element = angular.element("<home-view></home-view>");
        const renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('homeView');
    }

    afterEach(() => {
        sessionStorage.removeItem('project');
        sessionStorage.removeItem('user');
    });

    it('should stay home if no user is logged in and no project is open', () => {
        createController();

        $state.go('home');
        scope.$digest();

        expect(controller.user).toBeNull();
        expect(controller.project).toBeNull();
        expect($state.current.name).toEqual('home');
    });

    it('should stay home if a project is open but no user is logged in', () => {
        SessionService.saveProject(project);
        createController();

        $state.go('home');
        scope.$digest();

        expect(controller.user).toBeNull();
        expect(controller.project).toEqual(project);
        expect($state.current.name).toEqual('home');
    });

    it('should redirect to the project list if a user is logged in but no project is open', () => {
        SessionService.saveUser(user);
        createController();

        $state.go('home');
        scope.$digest();

        expect(controller.user).toEqual(user);
        expect(controller.project).toBeNull();
        expect($state.go).toHaveBeenCalledWith('projects');
    });

    it('should redirect to the project dashboard if a user is logged in and a project is open', () => {
        SessionService.saveUser(user);
        SessionService.saveProject(project);
        createController();

        $state.go('home');
        scope.$digest();

        expect(controller.user).toEqual(user);
        expect(controller.project).toEqual(project);
        expect($state.go).toHaveBeenCalledWith('projectsDashboard');
    });
});
