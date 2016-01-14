import {User, UserFormModel} from '../../../app/modules/entities/User';

describe('UserFormModel', () => {
    beforeEach(angular.mock.module('ALEX'));

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
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a new User from given data', () => {
        const u = ENTITIES.users[0];
        let user = new User(u);
        expect(Object.keys(user).length).toEqual(3);

        for (let prop in user) {
            expect(user[prop]).toEqual(u[prop]);
        }
    })
});