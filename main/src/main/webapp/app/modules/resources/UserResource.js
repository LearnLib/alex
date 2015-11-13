import {User} from '../entities/User';

/**
 * The resource to handle actions with users over the API
 */
// @ngInject
class UserResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Changes the password of a user
     *
     * @param {User} user - The user whose password should be changed
     * @param {string} oldPassword - The old password
     * @param {string} newPassword - The new password
     * @returns {*} - A promise
     */
    changePassword(user, oldPassword, newPassword) {
        return this.$http.put(`/rest/users/${user.id}/password`, {
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    }

    /**
     * Changes the email of a user
     *
     * @param {User} user - The user whose email should be changed
     * @param {string} email - The new email
     * @returns {*} - A promise
     */
    changeEmail(user, email) {
        return this.$http.put(`/rest/users/${user.id}/email`, {
            email: email
        });
    }

    /**
     * Gets a single user by its id
     *
     * @param {number} userId - The id of the user to get
     * @returns {*} - A promise
     */
    get(userId) {
        return this.$http.get(`/rest/users/${userId}`)
            .then(response => new User(response.data));
    }

    /**
     * Gets a list of all users. Should only be called by admins.
     *
     * @returns {*} - A promise
     */
    getAll() {
        return this.$http.get('/rest/users')
            .then(response => response.data.map(u => new User(u)))
    }

    /**
     * Creates a new user
     *
     * @param {UserFormModel} user - The user to create
     * @returns {*} - A promise
     */
    create(user) {
        return this.$http.post('/rest/users', user);
    }

    /**
     * Logs in a user
     *
     * @param {User} user - The user to login
     * @returns {*} - A promise that contains the jwt
     */
    login(user) {
        return this.$http.post('/rest/users/login', user);
    }

    /**
     * Removes a user
     *
     * @param {User} user - the user to remove
     * @returns {*} - A promise
     */
    remove(user) {
        return this.$http.delete(`/rest/users/${user.id}`, {});
    }

    /**
     * Updates a user. Should only be called by admins.
     *
     * @param {User} user - The user to update
     * @returns {*} - A promise that contains the updated user
     */
    update(user) {
        return this.$http.put(`/rest/users/${user.id}`, user)
            .then(response => new User(response.data))
    }
}

export default UserResource;