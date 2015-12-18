describe('CountersController', () => {
    let $controller, $q, $rootScope, CountersController, SessionService, CounterResource, ToastService, Counter, Project;
    let project;

    beforeEach(module('ALEX'));

    beforeEach(inject(($injector) => {
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        SessionService = $injector.get('SessionService');
        CounterResource = $injector.get('CounterResource');
        ToastService = $injector.get('ToastService');
        Counter = $injector.get('Counter');
        Project = $injector.get('Project');

        project = new Project(ENTITIES.projects[0]);
        SessionService.saveProject(project);
    }));

    afterEach(() => {
        SessionService.removeProject();
    });

    function createController() {
        CountersController = $controller('CountersController', {
            SessionService: SessionService,
            CounterResource: CounterResource,
            ToastService: ToastService
        });
    }

    function init() {
        const deferred = $q.defer();
        const counters = ENTITIES.counters;
        spyOn(CounterResource, 'getAll').and.returnValue(deferred.promise);
        createController();
        deferred.resolve(counters);
        $rootScope.$digest();
    }

    it('should initialize the controller correctly and load all counters', () => {
        const deferred = $q.defer();
        const counters = ENTITIES.counters;
        spyOn(SessionService, 'getProject').and.callThrough();
        spyOn(CounterResource, 'getAll').and.returnValue(deferred.promise);
        createController();

        expect(SessionService.getProject).toHaveBeenCalled();
        expect(CountersController.project).toEqual(project);
        expect(CountersController.counters).toEqual([]);
        expect(CountersController.selectedCounters).toEqual([]);

        deferred.resolve(counters);
        $rootScope.$digest();

        expect(CountersController.counters).toEqual(counters);
    });

    it('should delete a single counter from the server and from the list', () => {
        const deferred = $q.defer();
        const counter = CountersController.counters[0];
        const pre = CountersController.counters.length;
        spyOn(CounterResource, 'remove').and.returnValue(deferred.promise);
        spyOn(ToastService, 'success').and.callThrough();
        init();

        CountersController.deleteCounter(counter);
        deferred.resolve({});
        $rootScope.$digest();

        expect(CounterResource.remove).toHaveBeenCalledWith(project.id, counter);
        expect(ToastService.success).toHaveBeenCalled();
        expect(CountersController.counters.length).toBe(pre - 1);
        expect(CountersController.counters.find(c => c.name === counter.name)).toBeUndefined();
    });

    it('should display a message if the counters could not be fetched', () => {
        const deferred = $q.defer();
        const counter = CountersController.counters[0];
        const pre = CountersController.counters.length;
        spyOn(CounterResource, 'remove').and.returnValue(deferred.promise);
        spyOn(ToastService, 'danger').and.callThrough();
        init();

        CountersController.deleteCounter(counter);
        deferred.reject({data: {message: null}});
        $rootScope.$digest();

        expect(CounterResource.remove).toHaveBeenCalledWith(project.id, counter);
        expect(ToastService.danger).toHaveBeenCalled();
        expect(CountersController.counters.length).toBe(pre);
        expect(CountersController.counters.find(c => c.name === counter.name)).toEqual(counter);
    });

    it('should not delete counters if there are no selected ones', () => {
        spyOn(CounterResource, 'removeMany').and.callThrough();
        init();
        CountersController.deleteSelectedCounters();
        expect(CounterResource.removeMany).not.toHaveBeenCalled();
    });

    it('should delete all selected counters', () => {
        //const deferred = $q.defer();
        //
        //spyOn(CounterResource, 'removeMany').and.returnValue(deferred.promise);
        //spyOn(ToastService, 'success').and.callThrough();
        //
        //init();
        //const selectedCounters = [{name: 'i'}, {name: 'j'}];
        //CountersController.selectedCounters = selectedCounters;
        //
        //CountersController.deleteSelectedCounters();
        //deferred.resolve({});
        //$rootScope.$digest();
        //
        //console.log(CountersController.counters);
        //console.log(CountersController.selectedCounters)
        //
        //expect(CounterResource.removeMany).toHaveBeenCalledWith(project.id, CountersController.selectedCounters);
        //expect(ToastService.success).toHaveBeenCalled();

        // TODO
    });

    it('should display a message if selected counters could not be deleted', () => {
        const deferred = $q.defer();
        spyOn(ToastService, 'danger').and.callThrough();
        spyOn(CounterResource, 'removeMany').and.returnValue(deferred.promise);

        init();
        const selectedCounters = [ENTITIES.counters[0], ENTITIES.counters[1]];
        CountersController.selectedCounters = selectedCounters;

        CountersController.deleteSelectedCounters();
        deferred.reject({data: {message: null}});
        $rootScope.$digest();

        expect(ToastService.danger).toHaveBeenCalled();
        selectedCounters.forEach(c => {
            expect(CountersController.counters.findIndex(c2 => c2.name === c.name)).not.toBe(-1);
        })
    });
});