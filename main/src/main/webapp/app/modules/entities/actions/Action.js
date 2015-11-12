/** The action model all other actions should extend from */
class Action {

    /**
     * Constructor
     * @param {string} type - The unique action type
     * @param {boolean} negated - Whether the outcome is negated
     * @param {boolean} ignoreFailure - Whether the learner continues despite failure
     * @param {boolean} disabled - Whether the execution of the action should be skipped
     */
    constructor(type, negated = false, ignoreFailure = false, disabled = false) {
        this.type = type;
        this.negated = negated;
        this.ignoreFailure = ignoreFailure;
        this.disabled = disabled;
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