describe('Project', function () {

    var Project;

    var projects;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_Project_) {
        Project = _Project_;
        projects = TestDataProvider.projects;
    }));

    it('should create a new project', function () {
        var p = new Project();
        expect(p.name).toBeNull();
        expect(p.description).toBeNull();
        expect(p.baseUrl).toBeNull();

        p = new Project('name', 'url', 'description');
        expect(p.name).toBe('name');
        expect(p.description).toBe('description');
        expect(p.baseUrl).toBe('url');
    });

    it('should build a project instance from an api response', function () {
        var response = {data: projects};
        var ps = Project.transformApiResponse(response);
        expect(ps.length).toBeDefined();
        expect(ps.length).toBe(2);
        for (var i = 0; i < ps.length; i++) {
            expect(ps[i] instanceof Project).toBeTruthy();
        }
        response.data = [];
        expect(Project.transformApiResponse(response)).toEqual([]);
        response.data = projects[0];
        expect(Project.transformApiResponse(response) instanceof Project).toBeTruthy();
    });

    it('should build a project instance from an object', function () {
        var p = projects[0];
        expect(Project.build(p) instanceof Project).toBeTruthy();
        expect(Project.build(p).id).toBeDefined();

        p.anotherProperty = 'shouldNotAppear';
        expect(Project.build(p).anotherProperty).toBeUndefined();
    })
});