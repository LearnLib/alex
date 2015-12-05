import Action from '../Action';
import {actionType} from '../../../constants';

/** Clicks on a link with a specific text value */
class ClickLinkByTextWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.WEB_CLICK_LINK_BY_TEXT, obj);

        /**
         * The text of the link
         * @type {*|string}
         */
        this.value = obj.value || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return `Click on link with text "${this.value}"`;
    }
}

export default ClickLinkByTextWebAction;