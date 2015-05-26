describe('ErrorService', function () {

    var ErrorService,
        $state,
        $rootScope;

    var errorText = 'test error';

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_$rootScope_, _ErrorService_, _$state_) {
        $rootScope = _$rootScope_;
        ErrorService = _ErrorService_;
        $state = _$state_;
    }));

    it('should get an error message',
        function () {
            ErrorService.setErrorMessage(errorText);
            expect(ErrorService.getErrorMessage()).toEqual(errorText);
            expect(ErrorService.getErrorMessage()).toBeNull();
        });

    it('should get no error message',
        function () {
            expect(ErrorService.getErrorMessage()).toBeNull();
        });

    it('should redirect to the error page',
        function () {
            ErrorService.setErrorMessage(errorText);
            ErrorService.goToErrorPage();
            $rootScope.$digest();

            expect($state.current.name).toEqual('error');
        })
});