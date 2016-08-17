describe('resultsView', () => {
    let $rootScope, $q, $controller, $compile, $state, SessionService, LearnResultResource, PromptService, ToastService;
    let controller, project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        $controller = $injector.get('$controller');
        $compile = $injector.get('$compile');
        $state = $injector.get('$state');
        ToastService = $injector.get('ToastService');
        SessionService = $injector.get('SessionService');
        LearnResultResource = $injector.get('LearnResultResource');
        PromptService = $injector.get('PromptService');

        project = ENTITIES.projects[0];
        SessionService.saveProject(project);
    }));

    afterEach(() => {
        SessionService.removeProject();
    });

    function createComponent() {
        const d1 = $q.defer();
        spyOn(LearnResultResource, 'getAll').and.returnValue(d1.promise);
        d1.resolve(ENTITIES.learnResults);

        const element = angular.element("<results-view></results-view>");
        $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('resultsView');

        expect(controller.results).toEqual(ENTITIES.learnResults);
    }

    it('should delete a result if the user accepts it', () => {
        createComponent();

        const len = controller.results.length;
        const result = controller.results[0];

        let deferred = $q.defer();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);

        let deferred2 = $q.defer();
        spyOn(LearnResultResource, 'remove').and.returnValue(deferred2.promise);

        controller.deleteResult(result);
        deferred.resolve({});
        deferred2.resolve({});
        $rootScope.$digest();

        expect(controller.results.length).toEqual(len - 1);
        expect(controller.results.findIndex(r => r.testNo === result.testNo)).toBe(-1);
    });

    it('should not delete a result if the user denies it', () => {
        createComponent();

        const len = controller.results.length;

        let deferred = $q.defer();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);

        controller.deleteResult(controller.results[0]);
        deferred.reject({});
        $rootScope.$digest();

        expect(controller.results.length).toEqual(len);
    });

    it('should not delete a result if the deletion failed', () => {
        createComponent();

        const len = controller.results.length;
        const result = controller.results[0];

        let deferred = $q.defer();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);

        let deferred2 = $q.defer();
        spyOn(LearnResultResource, 'remove').and.returnValue(deferred2.promise);

        controller.deleteResult(result);
        deferred.resolve({});
        deferred2.reject({data: {message: null}});
        $rootScope.$digest();

        expect(controller.results.length).toEqual(len);
    });

    it('should not delete selected results if the user denies it', () => {
        createComponent();

        let deferred = $q.defer();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);

        const len = controller.results.length;
        controller.selectedResults = controller.results;
        controller.deleteResults();
        deferred.reject({});
        $rootScope.$digest();

        expect(controller.results.length).toEqual(len);
    });

    it('should not delete selected results if the deletion failed', () => {
        createComponent();

        let deferred = $q.defer();
        spyOn(PromptService, 'confirm').and.returnValue(deferred.promise);

        let deferred2 = $q.defer();
        spyOn(LearnResultResource, 'removeMany').and.returnValue(deferred2.promise);

        const len = controller.results.length;
        controller.selectedResults = controller.results;
        controller.deleteResults();
        deferred.resolve({});
        deferred2.reject({data: {message: null}});
        $rootScope.$digest();

        expect(controller.results.length).toEqual(len);
    });

    it('should not delete results if no result has been selected', () => {
        createComponent();

        const len = controller.results.length;
        controller.selectedResults = [];
        controller.deleteResults();
        $rootScope.$digest();

        expect(controller.results.length).toEqual(len);
    });

    it('should go to the result compare view', () => {
        createComponent();
        spyOn($state, 'go').and.callThrough();
        controller.selectedResults = [{testNo: 1}, {testNo: 2}];
        controller.openSelectedResults();
        $rootScope.$digest();

        expect($state.go).toHaveBeenCalledWith('resultsCompare', {testNos: '1,2'});
    });

    it('should not go to the result compare view if no result has been selected', () => {
        createComponent();
        spyOn($state, 'go').and.callThrough();
        controller.selectedResults = [];
        controller.openSelectedResults();
        $rootScope.$digest();

        expect($state.go).not.toHaveBeenCalled();
    });
});