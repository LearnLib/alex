describe('projectList', () => {
    let $state, ProjectResource, ToastService, SessionService, PromptService, EventBus, events, Project, $q;
    let $rootScope, $compile, renderedElement, controller;
    let projects;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        $state = $injector.get('$state');
        $q = $injector.get('$q');
        ProjectResource = $injector.get('ProjectResource');
        ToastService = $injector.get('ToastService');
        SessionService = $injector.get('SessionService');
        PromptService = $injector.get('PromptService');
        EventBus = $injector.get('EventBus');
        events = $injector.get('events');
        Project = $injector.get('Project');

        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');

        projects = ENTITIES.projects.map(p => new Project(p));
    }));

    function render() {
        const scope = $rootScope.$new();
        scope.projects = projects;

        const element = angular.element("<project-list projects='projects'></project-list>");
        renderedElement = $compile(element)(scope);
        controller = element.controller('projectList');
    }

    it('should initialize the component and list all projects', () => {
        render();
        $rootScope.$digest();

        expect(controller.projects).toEqual(projects);
        controller.projects.forEach(p => {
            expect(renderedElement.html()).toContain(p.name);
        });
    });

    it('should save a project in the session and go to its dashboard', () => {
        render();
        $rootScope.$digest();

        spyOn(SessionService, 'saveProject').and.callThrough();
        spyOn(EventBus, 'emit').and.callThrough();
        spyOn($state, 'go').and.callThrough();

        let project = controller.projects[0];
        controller.openProject(project);

        expect(SessionService.saveProject).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalledWith('projectsDashboard');
    });

    it('should delete a project after confirming', () => {
        render();
        $rootScope.$digest();

        const deferred = $q.defer();
        const deferred2 = $q.defer();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);
        spyOn(ProjectResource, 'remove').and.returnValue(deferred2.promise);
        spyOn(ToastService, 'success').and.callThrough();
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.resolve({});

        const project = controller.projects[0];
        controller.deleteProject(project);
        deferred2.resolve({});
        $rootScope.$digest();

        expect(PromptService.confirm).toHaveBeenCalled();
        expect(ProjectResource.remove).toHaveBeenCalled();
        expect(ToastService.success).toHaveBeenCalled();
        expect(EventBus.emit).toHaveBeenCalled();
    });

    it('should not delete a project if the deletion is not confirmed', () => {
        render();
        $rootScope.$digest();

        const deferred = $q.defer();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);
        spyOn(ProjectResource, 'remove').and.callThrough();
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.reject({});

        const project = controller.projects[0];
        controller.deleteProject(project);
        $rootScope.$digest();

        expect(PromptService.confirm).toHaveBeenCalled();
        expect(ProjectResource.remove).not.toHaveBeenCalled();
        expect(EventBus.emit).not.toHaveBeenCalled();
    });

    it('should display a message if a project could not be deleted', () => {
        render();
        $rootScope.$digest();

        const deferred = $q.defer();
        const deferred2 = $q.defer();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);
        spyOn(ProjectResource, 'remove').and.returnValue(deferred2.promise);
        spyOn(ToastService, 'danger').and.callThrough();
        spyOn(EventBus, 'emit').and.callThrough();
        deferred.resolve({});

        const project = controller.projects[0];
        controller.deleteProject(project);
        deferred2.reject({data: {message: null}});
        $rootScope.$digest();

        expect(PromptService.confirm).toHaveBeenCalled();
        expect(ProjectResource.remove).toHaveBeenCalled();
        expect(ToastService.danger).toHaveBeenCalled();
        expect(EventBus.emit).not.toHaveBeenCalled();
    })
});