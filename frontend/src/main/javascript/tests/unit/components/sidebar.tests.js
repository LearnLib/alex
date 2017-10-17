import {events} from '../../../src/js/constants';
import {Project} from '../../../src/js/entities/Project';
import {User} from '../../../src/js/entities/User';

describe('sidebar', () => {
    let $rootScope, $compile, $state, SessionService, EventBus;
    let controller;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $state = $injector.get('$state');
        SessionService = $injector.get('SessionService');
        EventBus = $injector.get('EventBus');

        SessionService.saveProject(ENTITIES.projects[0]);
        SessionService.saveUser(ENTITIES.users[0]);

        const element = angular.element(`
            <sidebar></sidebar>
        `);
        $compile(element)($rootScope);
        $rootScope.$digest();

        controller = element.controller('sidebar');
    }));
    afterEach(() => {
        SessionService.removeProject();
        SessionService.removeUser();
    });

    it('should log out a user', () => {
        controller.logout();

        expect(sessionStorage.getItem('project')).toBeNull();
        expect(sessionStorage.getItem('user')).toBeNull();
        expect(sessionStorage.getItem('jwt')).toBeNull();
        expect(controller.user).toBeNull();
        expect(controller.project).toBeNull();
    });

    it('should close a project', () => {
        controller.closeProject();
        expect(sessionStorage.getItem('project')).toBeNull();
        expect(controller.project).toBeNull();
    });

    it('should listen to the user login event', () => {
        const user = new User({
            id: '5',
            email: 'email@alex.example'
        });
        EventBus.emit(events.USER_LOGGED_IN, {user: user});
        expect(controller.user).toEqual(user);
    });

    it('should listen to the project open event', () => {
        const project = new Project({
            name: 'test',
            baseUrl: 'http://localhost'
        });
        EventBus.emit(events.PROJECT_OPENED, {project: project});
        expect(controller.project).toEqual(project);
    });

    it('should toggle collapse the sidebar', () => {
        expect(controller.collapsed).toBe(false);
        controller.toggleCollapse();
        expect(controller.collapsed).toBe(true);
        expect(document.body.classList.contains('layout-collapsed')).toBe(true);
        controller.toggleCollapse();
        expect(document.body.classList.contains('layout-collapsed')).toBe(false);
        expect(controller.collapsed).toBe(false);
    });

    it('should check for a given state', () => {
        $state.go('home');
        $rootScope.$digest();
        let result = controller.isState('a','home','b');
        expect(result).toBe(true);
        result = controller.isState('a','b');
        expect(result).toBe(false);
    });
});