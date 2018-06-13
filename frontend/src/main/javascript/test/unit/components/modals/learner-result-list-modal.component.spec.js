import {ResultListModalComponent} from '../../../../src/js/components/modals/learner-result-list-modal/learner-result-list-modal.component';
import {LearnResult} from '../../../../src/js/entities/learner-result';
import {events} from '../../../../src/js/constants';

describe('resultListModal', () => {
    let $controller, $uibModal, $compile, $rootScope;
    let modalInstance, controller, element, results, EventBus;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $controller = $injector.get('$controller');
        $uibModal = $injector.get('$uibModal');
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        EventBus = $injector.get('EventBus');

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        results = ENTITIES.learnResults.map(r => new LearnResult(r));
    }));
    afterEach(() => {
        document.body.innerHTML = '';
    });

    function createController() {
        controller = $controller(ResultListModalComponent, {
            $uibModalInstance: modalInstance,
            modalData: {results: results},
            EventBus: EventBus
        });

        $uibModal.open({
            template: '<div></div>',
            controller: () => controller,
            controllerAs: 'vm',
            resolve: {
                modalData: function () {
                    return {results: results};
                }
            }
        });

        $rootScope.$digest();
    }

    function createElement() {
        const scope = $rootScope.$new();
        element = angular.element("<button result-list-modal-handle results='results'>click me</button>");
        scope.results = results;
        $compile(element)(scope);
    }

    it('should open a dialog on click', () => {
        spyOn($uibModal, 'open').and.callThrough();
        createElement();
        element[0].click();
        expect($uibModal.open).toHaveBeenCalled();
    });

    it('should close the modal', () => {
        createController();
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should emit a selected result and close the modal', () => {
        spyOn(EventBus, 'emit').and.callThrough();
        createController();
        const result = controller.results[0];
        controller.selectResult(result);
        expect(EventBus.emit).toHaveBeenCalledWith(events.RESULT_SELECTED, {result: result});
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });
});
