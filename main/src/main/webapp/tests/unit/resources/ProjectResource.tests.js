import {Project, ProjectFormModel} from '../../../src/js/entities/Project';

describe('ProjectResource', () => {
    let $http;
    let $httpBackend;
    let ProjectResource;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject((_$http_, _ProjectResource_, _$httpBackend_) => {
        $http = _$http_;
        ProjectResource = _ProjectResource_;
        $httpBackend = _$httpBackend_;
    }));

    it('should correctly initialize the resource', () => {
        expect(ProjectResource.$http).toEqual($http);
    });

    it('should get all projects and return a list of project instances', () => {
        spyOn(ProjectResource.$http, 'get').and.callThrough();

        $httpBackend.whenGET('rest/projects').respond(200, ENTITIES.projects);
        const promise = ProjectResource.getAll();
        $httpBackend.flush();

        expect(ProjectResource.$http.get).toHaveBeenCalledWith('rest/projects');
        promise.then((projects) => {
            projects.forEach(p => expect(p instanceof Project).toBeTruthy());
        })
    });

    it('should create project a project from a form model an return an instance of the created project', () => {
        spyOn(ProjectResource.$http, 'post').and.callThrough();

        const projectToCreate = new ProjectFormModel();
        projectToCreate.name = 'project1';
        projectToCreate.baseUrl = 'http://localhost';
        projectToCreate.description = null;

        $httpBackend.whenPOST('rest/projects', projectToCreate).respond(201, ENTITIES.projects[0]);
        const promise = ProjectResource.create(projectToCreate);
        $httpBackend.flush();

        expect(ProjectResource.$http.post).toHaveBeenCalledWith('rest/projects', projectToCreate);
        promise.then((project) => {
            expect(project instanceof Project).toBeTruthy();
        })
    });

    it('should remove a project and return a promise', () => {
        spyOn(ProjectResource.$http, 'delete').and.callThrough();
        const project = ENTITIES.projects[0];

        $httpBackend.whenDELETE(`rest/projects/${project.id}`).respond(200, {});
        const promise = ProjectResource.remove(project);
        $httpBackend.flush();

        expect(ProjectResource.$http.delete).toHaveBeenCalledWith(`rest/projects/${project.id}`);
        expect(promise.then).toBeDefined();
        expect(promise.catch).toBeDefined();
    });

    it('should update a project and return an instance of the updated project in the promise', () => {
        spyOn(ProjectResource.$http, 'put').and.callThrough();

        const projectToUpdate = ENTITIES.projects[0];
        projectToUpdate.name = 'updatedName';

        $httpBackend.whenPUT(`rest/projects/${projectToUpdate.id}`, projectToUpdate)
            .respond(201, projectToUpdate);

        const promise = ProjectResource.update(projectToUpdate);
        $httpBackend.flush();

        expect(ProjectResource.$http.put).toHaveBeenCalledWith(`rest/projects/${projectToUpdate.id}`, projectToUpdate);
        promise.then((project) => {
            expect(project instanceof Project).toBeTruthy();
            expect(project).toEqual(projectToUpdate);
        })
    });
});