describe('FileDownloadService', function () {

    var FileDownloadService,
        $rootScope,
        $modal;

    var testFilename = 'test file';

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_FileDownloadService_, _$rootScope_, _$modalStack_) {
        FileDownloadService = _FileDownloadService_;
        $rootScope = _$rootScope_;
        $modal = _$modalStack_;
    }));

    function expectFileDownload() {
        expect($modal.getTop()).toBeDefined();
        expect($modal.getTop().key.opened.$$state.value).toBeTruthy();
        $modal.getTop().key.close(testFilename);
        expect($modal.getTop()).toBeUndefined();
    }

    it('should download a json file',
        function () {
            var object = {
                prop: 'test',
                list: [0, 1, 'sd', true],
                obj: {}
            };
            FileDownloadService.downloadJson(object);
            $rootScope.$digest();
            expectFileDownload();
        });

    it('should download an svg file',
        function () {
            var el = document.createElement('svg');
            FileDownloadService.downloadSVG(el);
            $rootScope.$digest();
            expectFileDownload();
        });

    it('should download a csv file',
        function () {
            var csv = 'a;b;c\n1;2;3';
            FileDownloadService.downloadCSV(csv);
            $rootScope.$digest();
            expectFileDownload();
        })
});