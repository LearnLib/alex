describe('FileResource', () => {
    let $http;
    let $httpBackend;
    let FileResource;

    let project;
    let files;
    let uri;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$http_, _FileResource_, _$httpBackend_) => {
        $http = _$http_;
        FileResource = _FileResource_;
        $httpBackend = _$httpBackend_;

        project = ENTITIES.projects[0];
        files = [
            {project: project.id, name: 'file1'},
            {project: project.id, name: 'file2'},
            {project: project.id, name: 'file3'}
        ];

        uri = `/rest/projects/${project.id}/files`;
    }));

    it('should correctly initialize the resource', () => {
        expect(FileResource.$http).toEqual($http);
    });

    it('should get all files', () => {
        spyOn(FileResource.$http, 'get').and.callThrough();

        $httpBackend.whenGET(uri).respond(200, files);
        const promise = FileResource.getAll(project.id);
        $httpBackend.flush();

        expect(FileResource.$http.get).toHaveBeenCalledWith(uri);
        promise.then(files => {
            expect(files).toEqual(files)
        })
    });

    it('should remove a single file', () => {
        spyOn(FileResource.$http, 'delete').and.callThrough();
        const encodedFileName = encodeURI(files[0].name);

        $httpBackend.whenDELETE(uri + '/' + encodedFileName).respond(200, {});
        const promise = FileResource.remove(project.id, files[0]);
        $httpBackend.flush();


        expect(FileResource.$http.delete).toHaveBeenCalledWith(uri + '/' + encodedFileName);
        expect(promise.then).toBeDefined();
    });
});
