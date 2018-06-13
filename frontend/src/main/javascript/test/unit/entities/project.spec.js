import {Project} from '../../../src/js/entities/project';

describe('Project', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a new Project from given data', () => {
        const p = ENTITIES.projects[0];
        let project = new Project(p);

        for (let prop in project) {
            expect(project[prop]).toEqual(p[prop]);
        }
    })
});
