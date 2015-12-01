import Action from '../Action';
import {actionType} from '../../../constants';

/**
 * Checks in a HTTP response body that is formatted in JSON if a specific attribute exists.
 * E.g. object.attribute.anotherAttribute
 */
class CheckAttributeExistsRestAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.REST_CHECK_ATTRIBUTE_EXISTS, obj);

        /**
         * The JSON property
         * @type {string}
         */
        this.attribute = obj.attribute || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Check if the JSON of a HTTP response has attribute "' + this.attribute + '"';
    };
}

export default CheckAttributeExistsRestAction;