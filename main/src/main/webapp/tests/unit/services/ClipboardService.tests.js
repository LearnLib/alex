describe('ClipboardService', () => {
    let ClipboardService;
    const item = {test: 'test'};

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(_ClipboardService_ => {
        ClipboardService = _ClipboardService_;
    }));

    it('should should copy an item correctly', () => {
        ClipboardService.copy('test', item);
        expect(ClipboardService.entries.has('test')).toBeTruthy();
        expect(ClipboardService.entries.get('test').mode).toEqual('copy');
    });

    it('should copy and paste an item correctly', () => {
        ClipboardService.copy('test', item);
        const copiedItem = ClipboardService.paste('test');
        expect(ClipboardService.entries.has('test')).toBeTruthy();
        expect(copiedItem).toEqual(item);
    });

    it('should cut an item correctly', () => {
        ClipboardService.cut('test', item);
        expect(ClipboardService.entries.has('test')).toBeTruthy();
        expect(ClipboardService.entries.get('test').mode).toEqual('cut');
    });

    it('should cut and paste an item correctly', () => {
        ClipboardService.cut('test', item);
        const cutItem = ClipboardService.paste('test');
        expect(ClipboardService.entries.has('test')).toBeFalsy();
        expect(cutItem).toEqual(item);
    });

    it('should return null on paste from non existing item', () => {
        const item = ClipboardService.paste('notExistingItem');
        expect(item).toBeNull();
    })
});