import {ConfirmDialogController} from '../../../../src/js/services/PromptService';

describe('ConfirmDialogController', () => {
    let $controller;
    let scope;
    let controller;
    let modalInstance;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$controller_, _$rootScope_) => {
        scope = _$rootScope_.$new();
        $controller = _$controller_;

        modalInstance = {
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
    }));

    function createController(txt) {
        controller = $controller(ConfirmDialogController, {
            $uibModalInstance: modalInstance,
            modalData: {text: txt}
        });
    }

    it('should initialize the controller correctly', () => {
        createController();
        expect(controller.$uibModalInstance).toEqual(modalInstance);
        expect(controller.text).toEqual(null);
    });

    it('should display a message in the confirm dialog that is given via modalData params', () => {
        createController('testMessage');
        expect(controller.text).toEqual('testMessage')
    });

    it('should close the modal dialog and resolve the modal promise',() => {
        createController();
        controller.ok();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should close the modal dialog and reject the modal promise', () => {
        createController();
        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });
});