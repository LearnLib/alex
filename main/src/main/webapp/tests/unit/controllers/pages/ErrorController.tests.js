describe('ErrorController', () => {
    let $controller;
    let scope;
    let $state;
    let ErrorService;
    let ErrorController;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$controller_, _$rootScope_, _$state_, _ErrorService_) => {
        $state = _$state_;
        scope = _$rootScope_.$new();
        $controller = _$controller_;
        ErrorService = _ErrorService_;

        spyOn($state, 'go').and.callThrough();
    }));

    function createController() {
        ErrorController = $controller('ErrorController', {
            $state: $state,
            ErrorService: ErrorService
        });
    }

    it('should display an error if there is a message', () => {
        const message = 'something failed';
        ErrorService.setErrorMessage(message);

        createController();
        $state.go('error');
        scope.$digest();

        expect($state.current.name).toEqual('error');
        expect(ErrorController.errorMessage).toEqual(message);
    });

    it('should redirect to home if there is no message to display', () => {
        createController();
        expect(ErrorController.errorMessage).toBeNull();
        $state.go('error');
        scope.$digest();

        expect($state.go).toHaveBeenCalledWith('home')
    });
});