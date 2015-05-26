describe('ToastService', function () {

    var $rootScope,
        $document,
        ngToast,
        ToastService;

    var testMessage = 'test toast message';

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_$rootScope_, _$document_, _ngToast_, _ToastService_) {
        $rootScope = _$rootScope_;
        $document = _$document_;
        ngToast = _ngToast_;
        ToastService = _ToastService_;
    }));

    it('should display a success toast',
        function () {
            ToastService.success(testMessage);
            expect(ngToast.messages.length).toBe(1);
            expect(ngToast.messages[0].class).toEqual('success');
            expect(ngToast.messages[0].content).toEqual(testMessage);
        });

    it('should display an info toast',
        function () {
            ToastService.info(testMessage);
            expect(ngToast.messages.length).toBe(1);
            expect(ngToast.messages[0].class).toEqual('info');
            expect(ngToast.messages[0].content).toEqual(testMessage);
        });

    it('should display a danger toast',
        function () {
            ToastService.danger(testMessage);
            expect(ngToast.messages.length).toBe(1);
            expect(ngToast.messages[0].class).toEqual('danger');
            expect(ngToast.messages[0].content).toEqual(testMessage);
        })
});
