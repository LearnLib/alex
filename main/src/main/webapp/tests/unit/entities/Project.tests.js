import {Project, ProjectFormModel} from '../../../app/modules/entities/Project';

describe('ProjectFormModel', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a new ProjectFormModel', () => {
        let project = new ProjectFormModel();
        expect(Object.keys(project).length).toEqual(3);
        expect(project.description).toBeNull();
        expect(project.name).toEqual('');
        expect(project.baseUrl).toEqual('');

        const p = ENTITIES.projects[0];
        project = new ProjectFormModel(p.name, p.baseUrl, p.description);
        expect(Object.keys(project).length).toEqual(3);

        for (let prop in project) {
            expect(project[prop]).toEqual(p[prop]);
        }
    });
});

describe('Project', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a new Project from given data', () => {
        const p = ENTITIES.projects[0];
        let project = new Project(p);
        expect(Object.keys(project).length).toEqual(5);

        for (let prop in project) {
            expect(project[prop]).toEqual(p[prop]);
        }
    })
});