describe('ToastService', () => {
    let ToastService;
    let scope;
    let toastr;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        ToastService = $injector.get('ToastService');
        scope = $injector.get('$rootScope').$new();
        toastr = $injector.get('toastr');
    }));

    it('should create a success toast', () => {
        spyOn(toastr, 'clear').and.callThrough();
        spyOn(toastr, 'success').and.callThrough();

        ToastService.success('message');
        scope.$digest();
        expect(toastr.clear).toHaveBeenCalled();
        expect(toastr.success).toHaveBeenCalledWith('message');
    });

    it('should create a danger toast', () => {
        spyOn(toastr, 'clear').and.callThrough();
        spyOn(toastr, 'error').and.callThrough();

        ToastService.danger('message');
        scope.$digest();
        expect(toastr.clear).toHaveBeenCalled();
        expect(toastr.error).toHaveBeenCalledWith('message');
    });

    it('should create am info toast', () => {
        spyOn(toastr, 'clear').and.callThrough();
        spyOn(toastr, 'info').and.callThrough();

        ToastService.info('message');
        scope.$digest();
        expect(toastr.clear).toHaveBeenCalled();
        expect(toastr.info).toHaveBeenCalledWith('message');
    })
});