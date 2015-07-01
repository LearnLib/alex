describe('ErrorController', function () {
    var $scope, $rootScope, $state, $controller, ErrorService;
    var createController;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _$state_, _ErrorService_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        ErrorService = _ErrorService_;
        $scope = $rootScope.$new();
        $state = _$state_;

        createController = function () {
            $controller('ErrorController', {
                $scope: $scope
            })
        }
    }));

    it('should display an error message if the error service has registered an error', function () {
        createController();
        $rootScope.$digest();
        expect($state.current.name).toEqual('home');
    });

    it('should display an error message', function () {
        ErrorService.setErrorMessage('test error');
        ErrorService.goToErrorPage();
        createController();
        $rootScope.$digest();
        expect($state.current.name).toEqual('error');
    });

    it('should redirect to the start page if no error has been set', function(){
        createController();
        $rootScope.$digest();
        expect($state.current.name).toEqual('home');
    })
});