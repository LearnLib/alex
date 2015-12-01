import Action from '../Action';
import {actionType} from '../../../constants';

/**
 * Checks if a property of a JSON object in a HTTP response body has a specific value or matches a regular
 * expression
 */
class CheckAttributeValueRestAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.REST_CHECK_ATTRIBUTE_VALUE, obj);

        /**
         * The JSON property
         * @type {string}
         */
        this.attribute = obj.attribute || '';

        /**
         * The value that is searched for in the property
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * Whether the value is a regular expression
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
            return 'Check if JSON attribute "' + this.attribute + '" matches "' + this.value + '"';
        } else {
            return 'Check JSON attribute "' + this.attribute + '" to equal "' + this.value + '"';
        }
    };
}

export default CheckAttributeValueRestAction;