import {User, UserFormModel} from '../../../src/js/entities/User';

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