import Action from '../Action';

/** Checks a value in the header fields of an HTTP response */
class CheckHeaderFieldRestAction extends Action {
    static get type() {
        return 'rest_checkHeaderField';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(CheckHeaderFieldRestAction.type);

        /**
         * The key of the header field
         * @type {*|string}
         */
        this.key = obj.key || '';

        /**
         * The expected value of the header field
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * Whether the value is interpreted as regular expression
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
            return 'Check if HTTP header field "' + this.key + '" matches "' + this.value + '"';
        } else {
            return 'Check HTTP header field "' + this.key + '" to equal "' + this.value + '"';
        }
    };
}

export default CheckHeaderFieldRestAction;