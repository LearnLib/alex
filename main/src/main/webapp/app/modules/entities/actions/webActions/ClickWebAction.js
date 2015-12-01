import Action from '../Action';
import {actionType} from '../../../constants';

/** Submits a form. Can also be applied to an input element of a form */
class ClickWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.WEB_CLICK, obj);

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