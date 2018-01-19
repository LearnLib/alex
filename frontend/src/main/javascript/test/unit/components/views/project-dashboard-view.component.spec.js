import {Project} from '../../../../src/js/entities/project';

describe('projectsDashboardView', () => {

    let $rootScope, $compile, $q, SessionService, SymbolGroupResource, LearnResultResource, LearnerResource;
    let controller, project;
    let element, renderedElement;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject($injector => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');
        SessionService = $injector.get('SessionService');
        SymbolGroupResource = $injector.get('SymbolGroupResource');
        LearnResultResource = $injector.get('LearnResultResource');
        LearnerResource = $injector.get('LearnerResource');

        project = new Project(ENTITIES.projects[0]);

        SessionService.saveProject(project);
    }));

    afterEach(() => {
        SessionService.removeProject();
    });

    function createComponent() {

        // child components call these on compile
        // just catch them and return dummy values
        var deferred = $q.defer();
        spyOn(SymbolGroupResource, 'getAll').and.returnValue(deferred.promise);
        spyOn(LearnResultResource, 'getAll').and.returnValue(deferred.promise);
        spyOn(LearnerResource, 'isActive').and.returnValue(deferred.promise);

        element = angular.element("<projects-dashboard-view></projects-dashboard-view>");
        renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('projectsDashboardView');
    }

    it('should load the project from the session on init', () => {
        createComponent();
        $rootScope.$digest();

        expect(controller.project).toEqual(project);
        expect(renderedElement.html()).toContain(project.name);
    });
});
