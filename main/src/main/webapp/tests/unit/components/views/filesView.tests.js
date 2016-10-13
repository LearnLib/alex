describe('filesView', () => {
    let $rootScope, $q, $controller, $compile, Upload, ToastService, SessionService, FileResource;
    let controller, project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        $controller = $injector.get('$controller');
        $compile = $injector.get('$compile');
        Upload = $injector.get('Upload');
        ToastService = $injector.get('ToastService');
        SessionService = $injector.get('SessionService');
        FileResource = $injector.get('FileResource');

        project = ENTITIES.projects[0];
        SessionService.saveProject(project);
    }));
    afterEach(() => {
        SessionService.removeProject();
    });

    function createComponent() {
        const d1 = $q.defer();
        spyOn(FileResource, 'getAll').and.returnValue(d1.promise);
        d1.resolve(ENTITIES.files);

        const element = angular.element("<files-view></files-view>");
        $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('filesView');

        expect(controller.files).toEqual(ENTITIES.files);
    }

    it('should show a message if loading files failed', () => {
        const d1 = $q.defer();
        spyOn(FileResource, 'getAll').and.returnValue(d1.promise);
        d1.reject({data: {message: 'error'}});

        spyOn(ToastService, 'danger').and.callThrough();

        const element = angular.element("<files-view></files-view>");
        $compile(element)($rootScope);
        $rootScope.$digest();

        expect(ToastService.danger).toHaveBeenCalled();
    });

    it('should delete a file', () => {
        createComponent();

        const d1 = $q.defer();
        spyOn(FileResource, 'remove').and.returnValue(d1.promise);
        d1.resolve({});

        const file = controller.files[0];
        controller.deleteFile(file);
        $rootScope.$digest();

        expect(FileResource.remove).toHaveBeenCalledWith(controller.project.id, file);
        expect(controller.files.findIndex(f => f.name === file.name)).toEqual(-1);
    });

    it('should delete multiple selected files', () => {
        createComponent();

        const d1 = $q.defer();
        spyOn(FileResource, 'remove').and.returnValue(d1.promise);
        d1.resolve({});

        const files = [controller.files[0], controller.files[1]];
        controller.selectedFiles = files;
        controller.deleteSelectedFiles();
        $rootScope.$digest();

        files.forEach(file => {
            expect(FileResource.remove).toHaveBeenCalledWith(controller.project.id, file);
            expect(controller.files.findIndex(f => f.name === file.name)).toEqual(-1);
        })
    });

    it('should upload a file', () => {
        createComponent();
    });
});