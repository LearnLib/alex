describe('ProjectFormModel', () => {
    let ProjectFormModel;

    beforeEach(module('ALEX'));
    beforeEach(inject((_ProjectFormModel_) => {
        ProjectFormModel = _ProjectFormModel_;
    }));

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
    let Project;

    beforeEach(module('ALEX'));
    beforeEach(inject((_Project_) => {
        Project = _Project_;
    }));

    it('should correctly create a new Project from given data', () => {
        const p = ENTITIES.projects[0];
        let project = new Project(p);
        expect(Object.keys(project).length).toEqual(5);

        for (let prop in project) {
            expect(project[prop]).toEqual(p[prop]);
        }
    })
});