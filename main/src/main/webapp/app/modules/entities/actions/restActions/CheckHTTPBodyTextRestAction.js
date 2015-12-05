import Action from '../Action';
import {actionType} from '../../../constants';

/** Searches for a string value in the body of an HTTP response */
class CheckHTTPBodyTextRestAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.REST_CHECK_FOR_TEXT, obj);

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
    }
}

export default CheckHTTPBodyTextRestAction;