import {Project} from '../../../src/js/entities/Project';

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