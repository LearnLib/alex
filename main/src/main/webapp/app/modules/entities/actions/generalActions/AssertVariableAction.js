import Action from '../Action';

/** Action to check if the value of a variable equals or matches a specific string value */
class AssertVariableAction extends Action {
    static get type() {
        return 'assertVariable';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(AssertVariableAction.type, obj);

        /**
         * The name of the variable
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The value to assert against
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * If value is a regular expression
         * @type {*|boolean}
         */
        this.regexp = obj.regexp || false;
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        if (this.regexp) {
            return 'Assert variable "' + this.name + '" to match "' + this.value + '"';
        } else {
            return 'Assert variable "' + this.name + '" to equal "' + this.value + '"';
        }
    }
}

export default AssertVariableAction;