import Action from '../Action';
import {actionType} from '../../../constants';

/** Searches for an element with a specific selector in the HTML document */
class CheckForNodeWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.WEB_CHECK_NODE, obj);

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