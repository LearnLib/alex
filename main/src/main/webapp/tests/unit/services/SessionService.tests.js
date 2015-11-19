describe('SessionService', () => {
    let EventBus;
    let SessionService;
    let Project;
    let User;

    let project;
    let user;

    beforeEach(module('ALEX'));
    beforeEach(inject((_EventBus_, _SessionService_, _User_, _Project_) => {
        EventBus = _EventBus_;
        SessionService = _SessionService_;
        User = _User_;
        Project = _Project_;

        project = new Project({id: 1});
        user = new User({id: 1});
    }));

    it('should save a project in the sessionStorage and emit the project:opened event', () => {
        EventBus.on('project:opened', (evt, data) => {
            expect(data.project.id).toEqual(project.id);
        });
        SessionService.project.save(project);
        expect(sessionStorage.getItem('project')).toBeDefined();
    });

    it('should save a user in the sessionStorage and emit the user:loggedIn event', () => {
        EventBus.on('user:loggedIn', (evt, data) => {
            expect(data.user.id).toEqual(user.id);
        });
        SessionService.user.save(user);
        expect(sessionStorage.getItem('user')).toBeDefined();
    });

    it('should get the instance of the project', () => {
        const p = SessionService.project.get();
        expect(p instanceof Project).toBeTruthy();
        expect(p.id).toEqual(project.id);
    });

    it('should get the instance of the user', () => {
        const u = SessionService.user.get();
        expect(u instanceof User).toBeTruthy();
        expect(u.id).toEqual(user.id);
    });

    it('should remove the project in the session', () => {
        SessionService.project.save(project);
        SessionService.project.remove();
        expect(sessionStorage.getItem('project')).toBeNull();
    });

    it('should remove the user in the session', () => {
        SessionService.user.save(project);
        SessionService.user.remove();
        expect(sessionStorage.getItem('user')).toBeNull();
        expect(sessionStorage.getItem('jwt')).toBeNull();
    });

    it('should return null if no project is in the session', () => {
        expect(SessionService.project.get()).toBeNull();
    });

    it('should return null if no user is in the session', () => {
        expect(SessionService.user.get()).toBeNull();
    });
});