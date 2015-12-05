import Action from '../Action';
import {actionType} from '../../../constants';

/** Searches for a piece of text or a regular expression in the HTML document */
class CheckPageTitleAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.WEB_CHECK_PAGE_TITLE, obj);

        /**
         * The page title to look for or the regexp to match the title against
         * @type {*|string}
         */
        this.title = obj.title || '';

        /**
         * If the title should be interpreted as regexp
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
            return 'Check if the page title matches "' + this.title + '"';
        } else {
            return 'Check if the page title equals "' + this.title + '"';
        }
    }
}

export default CheckPageTitleAction;