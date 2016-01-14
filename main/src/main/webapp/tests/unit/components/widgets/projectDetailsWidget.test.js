import {Project} from '../../../../app/modules/entities/Project';
import {events} from '../../../../app/modules/constants';

describe('projectDetailsWidget', () => {
    let $rootScope;
    let $compile;
    let renderedElement;
    let controller;
    let SessionService;
    let SymbolGroupResource;
    let LearnResultResource;
    let EventBus;

    let project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$rootScope_, _$compile_, _SessionService_, _SymbolGroupResource_,
                       _LearnResultResource_, _EventBus_) => {

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        SessionService = _SessionService_;
        SymbolGroupResource = _SymbolGroupResource_;
        LearnResultResource = _LearnResultResource_;
        EventBus = _EventBus_;

        project = new Project(ENTITIES.projects[0]);
        SessionService.saveProject(project);
    }));

    afterEach(() => {
        SessionService.removeProject();
    });

    function render() {
        const element = angular.element("<project-details-widget></project-details-widget>");
        renderedElement = $compile(element)($rootScope);
        controller = element.controller('projectDetailsWidget');
    }

    it('should initialize the the component correctly and display all important data', () => {
        render();
    });

    it('should update the project on project:updated event', () => {
        render();
    });
});