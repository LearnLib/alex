import {PromptService, PromptDialogController, ConfirmDialogController} from '../../../src/js/services/prompt.service';

describe('PromptService', () => {
    let PromptService, $uibModal, $controller, $rootScope;
    let promptCtrl, confirmCtrl;
    let modalInstance;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        PromptService = $injector.get('PromptService');
        $uibModal = $injector.get('$uibModal');
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');

        // mock modalInstance
        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then'),
                catch: jasmine.createSpy('modalInstance.result.catch')
            }
        };

        promptCtrl = $controller(PromptDialogController, {
            $uibModalInstance: modalInstance,
            modalData: {text: 'test text'}
        });

        confirmCtrl = $controller(ConfirmDialogController, {
            $uibModalInstance: modalInstance,
            modalData: {text: 'test text'}
        });
    }));

    it('should open a prompt dialog', () => {
        spyOn($uibModal, 'open').and.callThrough();

        const result = PromptService.prompt();

        expect($uibModal.open).toHaveBeenCalled();
        expect(result.then).toBeDefined();
    });

    it('should should open a conform dialog', () => {
        spyOn($uibModal, 'open').and.callThrough();

        const result = PromptService.confirm();

        expect($uibModal.open).toHaveBeenCalled();
        expect(result.then).toBeDefined();
    });

    it('should close the prompt modal and reject the promise', () => {
        promptCtrl.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should close the prompt modal and resolve the promise and return user input', () => {
        promptCtrl.userInput = 'test input';
        promptCtrl.ok();
        expect(modalInstance.close).toHaveBeenCalledWith('test input');
    });

    it('should close the confirm dialog and reject the promise', () => {
        confirmCtrl.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should close the confirm dialog an resolve the promise', () => {
        confirmCtrl.ok();
        expect(modalInstance.close).toHaveBeenCalled();
    });
});
