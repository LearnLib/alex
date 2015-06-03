describe('ClipboardService', function () {

    var ClipboardService;
    var data1, data2;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_ClipboardService_) {
        ClipboardService = _ClipboardService_;
        data1 = TestDataProvider.counters;
        data2 = TestDataProvider.projects;
    }));

    it('should copy data into the clipboard', function () {
        ClipboardService.copy('data', data1);
        expect(ClipboardService.entries.data.mode).toBe(1);
        expect(ClipboardService.entries.data.data).toEqual(data1);
    });

    it('should cut data into the clipboard', function () {
        ClipboardService.cut('data', data1);
        expect(ClipboardService.entries.data.mode).toBe(0);
        expect(ClipboardService.entries.data.data).toEqual(data1);
    });

    it('should overwrite an existing entry', function(){
        ClipboardService.copy('data', data1);
        expect(ClipboardService.entries.data.data).toEqual(data1);
        ClipboardService.copy('data', data2);
        expect(ClipboardService.entries.data.data).toEqual(data2);
    });

    it('should paste data from the clipboard after copy and keep the entry', function () {
        ClipboardService.copy('data', data1);
        ClipboardService.paste('data');
        expect(ClipboardService.entries.data).toBeDefined();
        expect(ClipboardService.entries.data.data).toEqual(data1);
    });

    it('should paste data from the clipboard after cut and remove the entry', function () {
        ClipboardService.cut('data', data1);
        ClipboardService.paste('data');
        expect(ClipboardService.entries.data).toBeUndefined();
    })
});
