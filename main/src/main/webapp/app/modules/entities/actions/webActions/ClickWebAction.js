import Action from '../Action';

/** Submits a form. Can also be applied to an input element of a form */
class ClickWebAction extends Action {
    static get type() {
        return 'web_click';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(ClickWebAction.type, obj);

        /**
         * The CSS selector of an element
         * @type {*|string}
         */
        this.node = obj.node || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return `Click on "${this.node}"`;
    };
}

export default ClickWebAction;