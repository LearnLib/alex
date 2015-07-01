describe('ProjectResource', function () {

    var ProjectResource, Project, $httpBackend, _, ProjectMockData;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));

    beforeEach(angular.mock.inject(function (_$httpBackend_, _ProjectResource_, _Project_, ___, _ProjectMockData_) {
        Project = _Project_;
        ProjectResource = _ProjectResource_;
        $httpBackend = _$httpBackend_;
        _ = ___;
        ProjectMockData = _ProjectMockData_;
    }));

    it('should make a GET request to /projects/ and return a promise with a list of all projects',
        function () {
            var projects;
            var promise = ProjectResource.getAll();
            expect(angular.isFunction(promise.then)).toBeTruthy();
            promise.then(function (p) {
                projects = p;
            });
            $httpBackend.flush();
            expect(projects instanceof Array).toBeTruthy();
            _.forEach(projects, function (p) {
                expect(p instanceof Project).toBeTruthy();
            })
        });

    it('should make a GET request to /projects/:projectId and return a promise with a single project',
        function () {
            var project;
            var promise = ProjectResource.get(1);
            expect(angular.isFunction(promise.then)).toBeTruthy();
            promise.then(function (p) {
                project = p;
            });
            $httpBackend.flush();
            expect(project instanceof Project).toBeTruthy();
        });

    it('should make a POST request to /projects/ and return a promise with the new project',
        function () {
            var newProject;
            var project = new Project('newProject', 'http://localhost');
            var promise = ProjectResource.create(project);
            expect(angular.isFunction(promise.then)).toBeTruthy();
            promise.then(function (p) {
                newProject = p;
            });
            $httpBackend.flush();
            expect(newProject instanceof Project).toBeTruthy();
            expect(newProject.id).toBeDefined();
        });

    it('should make a PUT request to /projects/:projectId and return a promise with an updated project',
        function () {
            var updatedProject;
            var project = ProjectMockData.getById(1);
            project.name = 'UpdatedName';
            var promise = ProjectResource.update(project);
            expect(angular.isFunction(promise.then)).toBeTruthy();
            promise.then(function (p) {
                updatedProject = p;
            });
            $httpBackend.flush();
            expect(updatedProject instanceof Project).toBeTruthy();
            expect(updatedProject.name).toEqual(project.name);
        });

    it('should make a DELETE request to /projects/:projectId/ and return a promise with an response',
        function () {
            var project = ProjectMockData.getById(1);
            var promise = ProjectResource.delete(project);
            expect(angular.isFunction(promise.then)).toBeTruthy();
            promise.then(function (response) {
                expect(response.data).toEqual({});
                expect(response.status).toBeDefined();
            });
            $httpBackend.flush();
        })
});