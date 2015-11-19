describe('ToastService', () => {
    let ToastService;
    let scope;
    let ngToast;

    beforeEach(module('ALEX'));
    beforeEach(inject((_$rootScope_, _ToastService_, _ngToast_) => {
        ToastService = _ToastService_;
        scope = _$rootScope_.$new();
        ngToast = _ngToast_;

        spyOn(ngToast, 'create').and.callThrough();
    }));

    it('should correctly instantiate the ToastService', () => {
        expect(ToastService.ngToast).toEqual(ngToast);
    });

    it('should create an arbitrary toast', () => {
        ToastService.createToast('warning', 'message');
        scope.$digest();
        expect(ngToast.create).toHaveBeenCalledWith({
            className: 'warning',
            content: 'message',
            dismissButton: true
        });
    });

    it('should create a success toast', () => {
        ToastService.success('message');
        scope.$digest();
        expect(ngToast.create).toHaveBeenCalledWith({
            className: 'success',
            content: 'message',
            dismissButton: true
        });
    });

    it('should create a danger toast', () => {
        ToastService.danger('message');
        scope.$digest();
        expect(ngToast.create).toHaveBeenCalledWith({
            className: 'danger',
            content: 'message',
            dismissButton: true
        });
    });

    it('should create am info toast', () => {
        ToastService.info('message');
        scope.$digest();
        expect(ngToast.create).toHaveBeenCalledWith({
            className: 'info',
            content: 'message',
            dismissButton: true
        });
    })
});