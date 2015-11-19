import Action from '../Action';

/** Clicks on a link with a specific text value */
class ClickLinkByTextWebAction extends Action {
    static get type() {
        return 'web_clickLinkByText';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(ClickLinkByTextWebAction.type, obj);

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
    };
}

export default ClickLinkByTextWebAction;