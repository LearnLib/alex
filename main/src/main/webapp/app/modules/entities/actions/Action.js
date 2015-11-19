/** The action model all other actions should extend from */
class Action {

    /**
     * Constructor
     * @param {string} type - The type of the action
     * @param {object} obj - The object to create an action from
     */
    constructor(type, obj) {

        /**
         * The unique action type
         * @type {String}
         */
        this.type = type || '';

        /**
         * Whether the outcome is negated
         * @type {boolean}
         */
        this.negated = obj.negated || false;

        /**
         * Whether the learner continues despite failure
         * @type {boolean}
         */
        this.ignoreFailure = obj.ignoreFailure || false;

        /**
         * Whether the execution of the action should be skipped
         * @type {boolean}
         */
        this.disabled = obj.disabled || false;
    }

    /**
     * Manually set a property
     * @param {string} key
     * @param {any} value
     */
    set(key, value) {
        this[key] = value;
    }

    /**
     * Get a string representation of the action
     * @returns {string}
     */
    toString() {
        return 'There is no string representation available for type "' + this.type + '"';
    }
}

export default Action;