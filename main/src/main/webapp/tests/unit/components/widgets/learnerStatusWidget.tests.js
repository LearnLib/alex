describe('learnerStatusWidget', () => {
    let $rootScope, $controller, $q, $compile, LearnerResource, ToastService;
    let controller;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector)=> {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $q = $injector.get('$q');
        $compile = $injector.get('$compile');
        LearnerResource = $injector.get('LearnerResource');
        ToastService = $injector.get('ToastService');
    }));

    function createComponent() {
        const element = angular.element('<learner-status-widget></learner-status-widget>');
        $compile(element)($rootScope);
        controller = element.controller('learnerStatusWidget');
    }

    it('should do nothing if the learner is not active', () => {
        const d1 = $q.defer();
        spyOn(LearnerResource, 'isActive').and.returnValue(d1.promise);
        d1.resolve({active: true});

        createComponent();
        $rootScope.$digest();

        expect(controller.isActive).toBe(true);
        expect(controller.hasFinished).toBe(false);
        expect(controller.result).toBe(null);
    });

    it('should display a result if the learner has finished learning', () => {
        const d1 = $q.defer();
        const d2 = $q.defer();
        spyOn(LearnerResource, 'isActive').and.returnValue(d1.promise);
        spyOn(LearnerResource, 'getStatus').and.returnValue(d2.promise);
        d1.resolve({active: false});
        d2.resolve(ENTITIES.learnResults[0]);

        createComponent();
        $rootScope.$digest();

        expect(controller.isActive).toBe(false);
        expect(controller.hasFinished).toBe(true);
        expect(controller.result).toEqual(ENTITIES.learnResults[0]);
    });

    it('should abort the learn process', () => {
        const d1 = $q.defer();
        const d2 = $q.defer();
        spyOn(LearnerResource, 'stop').and.returnValue(d1.promise);
        spyOn(LearnerResource, 'isActive').and.returnValue(d2.promise);
        d1.resolve({});
        d2.resolve({active: true});

        createComponent();
        controller.abort();
        $rootScope.$digest();

        expect(LearnerResource.stop).toHaveBeenCalled();
    });
});