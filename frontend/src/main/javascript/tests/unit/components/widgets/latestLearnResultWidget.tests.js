describe('latestLearnResultWidget', () => {
    let $rootScope, $controller, $q, $compile, LearnResultResource, SessionService;
    let controller, project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $q = $injector.get('$q');
        $compile = $injector.get('$compile');
        LearnResultResource = $injector.get('LearnResultResource');
        SessionService = $injector.get('SessionService');

        project = ENTITIES.projects[0];
        SessionService.saveProject(project);
    }));
    afterEach(() => {
        SessionService.removeProject();
    });

    function createComponent() {
        const element = angular.element('<latest-learn-result-widget></latest-learn-result-widget>');
        $compile(element)($rootScope);
        controller = element.controller('latestLearnResultWidget');
    }

    it('should load the latest learner result', () => {
        const results = ENTITIES.learnResults;
        const d1 = $q.defer();
        spyOn(LearnResultResource, 'getAll').and.returnValue(d1.promise);
        d1.resolve(results);

        createComponent();
        $rootScope.$digest();
        expect(controller.result).toEqual(results[results.length - 1]);
    });

    it('should display nothing if no result is available', () => {
        const d1 = $q.defer();
        spyOn(LearnResultResource, 'getAll').and.returnValue(d1.promise);
        d1.resolve([]);

        createComponent();
        $rootScope.$digest();
        expect(controller.result).toBeNull();
    });
});