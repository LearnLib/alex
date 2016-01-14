describe('ConfirmDialogController', () => {
    let $controller;
    let scope;
    let ConfirmDialogController;
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
        ConfirmDialogController = $controller('ConfirmDialogController', {
            $modalInstance: modalInstance,
            modalData: {text: txt}
        });
    }

    it('should initialize the controller correctly', () => {
        createController();
        expect(ConfirmDialogController.$modalInstance).toEqual(modalInstance);
        expect(ConfirmDialogController.text).toEqual(null);
    });

    it('should display a message in the confirm dialog that is given via modalData params', () => {
        createController('testMessage');
        expect(ConfirmDialogController.text).toEqual('testMessage')
    });

    it('should close the modal dialog and resolve the modal promise',() => {
        createController();
        ConfirmDialogController.ok();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should close the modal dialog and reject the modal promise', () => {
        createController();
        ConfirmDialogController.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });
});