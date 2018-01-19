import {Project} from '../../../../src/js/entities/project';
import {SymbolGroup} from '../../../../src/js/entities/symbol-group';
import {LearnResult} from '../../../../src/js/entities/learner-result';
import {events} from '../../../../src/js/constants';

describe('projectDetailsWidget', () => {
    let $rootScope, $compile, $q, SessionService, SymbolGroupResource, LearnResultResource, EventBus;
    let controller, project, renderedElement;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {

        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');
        SessionService = $injector.get('SessionService');
        SymbolGroupResource = $injector.get('SymbolGroupResource');
        LearnResultResource = $injector.get('LearnResultResource');
        EventBus = $injector.get('EventBus');

        project = new Project(ENTITIES.projects[0]);
        SessionService.saveProject(project);
    }));
    afterEach(() => {
        SessionService.removeProject();
    });

    function createComponent() {

        const d1 = $q.defer();
        const d2 = $q.defer();
        spyOn(SymbolGroupResource, 'getAll').and.returnValue(d1.promise);
        spyOn(LearnResultResource, 'getAll').and.returnValue(d2.promise);

        const groups = ENTITIES.groups.map(g => new SymbolGroup(g));
        const results = ENTITIES.learnResults.map(r => new LearnResult(r));

        d1.resolve(groups);
        d2.resolve(results);

        const element = angular.element("<project-details-widget></project-details-widget>");
        renderedElement = $compile(element)($rootScope);
        controller = element.controller('projectDetailsWidget');
        $rootScope.$digest();

        const numberOfSymbols = groups.map(g => g.symbols.length)
            .reduce((a, b) => a + b);

        expect(controller.numberOfGroups).toEqual(groups.length);
        expect(controller.numberOfSymbols).toEqual(numberOfSymbols);
        expect(controller.numberOfTests).toEqual(results.length);
    }

    it('should initialize the the component correctly and display all important data', () => {
        createComponent();
    });

    it('should update the project on project:updated event', () => {
        createComponent();
        const project = new Project({
            name: 'test',
            baseUrl: 'http://localhost'
        });
        EventBus.emit(events.PROJECT_UPDATED, {project: project});
        expect(controller.project).toEqual(project);
    });
});
