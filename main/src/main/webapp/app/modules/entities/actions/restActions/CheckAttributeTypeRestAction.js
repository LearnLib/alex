import Action from '../Action';

/** Checks if a property of the JSON of a HTTP response has a specific type */
class CheckAttributeTypeRestAction extends Action {
    static get type() {
        return 'rest_checkAttributeType';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(CheckAttributeTypeRestAction.type);

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