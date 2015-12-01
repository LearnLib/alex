import Action from '../Action';
import {actionType} from '../../../constants';


/** Checks if a property of the JSON of a HTTP response has a specific type */
class CheckAttributeTypeRestAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.REST_CHECK_ATTRIBUTE_TYPE, obj);

        /**
         * The JSON property
         * @type {string}
         */
        this.attribute = obj.attribute || '';

        /**
         * The Type in {INTEGER,STRING,BOOLEAN,OBJECT}
         * @type {string}
         */
        this.jsonType = obj.jsonType || 'STRING';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Check the JSON attribute "' + this.attribute + '" is type of "' + this.jsonType + '"';
    };
}

export default CheckAttributeTypeRestAction;