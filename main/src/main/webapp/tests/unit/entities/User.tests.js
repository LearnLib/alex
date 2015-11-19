describe('UserFormModel', () => {
    let UserFormModel;

    beforeEach(module('ALEX'));
    beforeEach(inject((_UserFormModel_) => {
        UserFormModel = _UserFormModel_;
    }));

    it('should correctly create a new UserFormModel', () => {
        let user = new UserFormModel();
        expect(Object.keys(user).length).toEqual(2);
        expect(user.email).toEqual('');
        expect(user.password).toEqual('');

        user = new UserFormModel('email', 'password');
        expect(Object.keys(user).length).toEqual(2);
        expect(user.email).toEqual('email');
        expect(user.password).toEqual('password');
    });
});

describe('User', () => {
    let User;

    beforeEach(module('ALEX'));
    beforeEach(inject((_User_) => {
        User = _User_;
    }));

    it('should correctly create a new User from given data', () => {
        const u = ENTITIES.users[0];
        let user = new User(u);
        expect(Object.keys(user).length).toEqual(3);

        for (let prop in user) {
            expect(user[prop]).toEqual(u[prop]);
        }
    })
});