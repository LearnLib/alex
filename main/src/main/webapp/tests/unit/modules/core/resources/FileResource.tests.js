describe('FileResource', function () {

    var FileResource;
    var $httpBackend;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));

    beforeEach(angular.mock.inject(function (_$httpBackend_, _FileResource_) {
        FileResource = _FileResource_;
        $httpBackend = _$httpBackend_;
    }));

    it('should make a GET request to /projects/:projectId/files and return a promise with all files',
        function () {
            var files;
            var promise = FileResource.getAll(1);
            expect(angular.isFunction(promise.then)).toBeTruthy();
            promise.then(function (f) {
                files = f;
            });
            $httpBackend.flush();
            expect(files instanceof Array).toBeTruthy();
        });

    it('should make a DELETE request to /projects/:projectId/files/:fileNames and return a promise with a response objects',
        function () {
            var response;
            var promise = FileResource.delete(1, 'file1');
            expect(angular.isFunction(promise.then)).toBeTruthy();
            $httpBackend.flush();
        })
});