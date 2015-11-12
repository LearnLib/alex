/** The model for user forms */
class UserFormModel {

    /**
     * Constructor
     * @param {string} email - The email of the user
     * @param {string} password - The unencrypted password of the user
     */
    constructor(email = '', password = '') {
        this.email = email;
        this.password = password;
    }
}

/** The model for user api results */
class User {

    /**
     * Constructor
     * @param {object} obj - The object to create a user from
     */
    constructor(obj) {

        /**
         * The id of the user
         * @type {*|number}
         */
        this.id = obj.id;

        /**
         * The role of the user
         * @type {*|string}
         */
        this.role = obj.role;

        /**
         * The email of the user
         * @type {*|string}
         */
        this.email = obj.email;
    }
}

export {UserFormModel, User};