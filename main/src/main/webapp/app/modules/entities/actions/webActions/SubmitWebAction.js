import Action from '../Action';
import {actionType} from '../../../constants';

/** Submits a form. Can also be applied to an input element of a form */
class SubmitWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.WEB_SUBMIT, obj);

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