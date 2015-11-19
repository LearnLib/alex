import Action from '../Action';

/** Submits a form. Can also be applied to an input element of a form */
class SubmitWebAction extends Action {
    static get type() {
        return 'web_submit';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(SubmitWebAction.type, obj);

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
        return `Submit form "${this.node}"`;
    };
}

export default SubmitWebAction;