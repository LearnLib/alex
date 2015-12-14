describe('projectDetailsWidget', () => {
    let $rootScope;
    let $compile;
    let renderedElement;
    let controller;
    let Project;
    let SessionService;
    let SymbolGroupResource;
    let LearnResultResource;
    let EventBus;
    let events;

    let project;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$rootScope_, _$compile_, _Project_, _SessionService_, _SymbolGroupResource_,
                       _LearnResultResource_, _EventBus_, _events_) => {

        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Project = _Project_;
        SessionService = _SessionService_;
        SymbolGroupResource = _SymbolGroupResource_;
        LearnResultResource = _LearnResultResource_;
        EventBus = _EventBus_;
        events = _events_;

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