import Action from '../Action';

/** Searches for an element with a specific selector in the HTML document */
class CheckForNodeWebAction extends Action {
    static get type() {
        return 'web_checkForNode';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(CheckForNodeWebAction.type, obj, obj);

        /**
         * The selector of the node to search
         * @type {string}
         */
        this.value = obj.value || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Search for element "' + this.value + '"';
    };
}

export default CheckForNodeWebAction;