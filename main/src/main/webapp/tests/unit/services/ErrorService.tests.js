describe('ErrorService', () => {
    let ErrorService;
    let scope;
    let $state;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$rootScope_, _$state_, _ErrorService_) => {
        ErrorService = _ErrorService_;
        scope = _$rootScope_.$new();
        $state = _$state_;

        spyOn($state, 'go').and.callThrough();
    }));

    it('should correctly initialize the service', () => {
        expect(ErrorService.$state).toBeDefined();
        expect(ErrorService.errorMessage).toBeNull();
    });

    it('should be able to get the error message only once', () => {
        ErrorService.errorMessage = 'error';
        expect(ErrorService.getErrorMessage()).toEqual('error');
        expect(ErrorService.getErrorMessage()).toBeNull();
    });

    it('should set the error message and redirect to the error page', () => {
        ErrorService.setErrorMessage('error');
        scope.$digest();
        expect(ErrorService.errorMessage).toEqual('error');
    });
});