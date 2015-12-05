import Action from '../Action';
import {actionType} from '../../../constants';

/** Searches for a piece of text or a regular expression in the HTML document */
class CheckForTextWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.WEB_CHECK_TEXT, obj);

        /**
         * The piece of text to look for
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
            return 'Check if the document matches "' + this.value + '"';
        } else {
            return 'Search for "' + this.value + '" in the document';
        }
    }
}

export default CheckForTextWebAction;