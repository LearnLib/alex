import Action from '../Action';

/** Searches for a string value in the body of an HTTP response */
class CheckHTTPBodyTextRestAction extends Action {
    static get type() {
        return 'rest_checkForText';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(CheckHTTPBodyTextRestAction.type);

        /**
         * The string that is searched for
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
            return 'Search in the response with regexp "' + this.value + '"';
        } else {
            return 'Search in the response body for "' + this.value + '"';
        }
    };
}

export default CheckHTTPBodyTextRestAction;