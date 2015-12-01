import Action from '../Action';
import {actionType} from '../../../constants';

/** Fills an input element with a value */
class FillWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.WEB_FILL, obj);

        /**
         * The CSS selector of an element
         * @type {*|string}
         */
        this.node = obj.node || '';

        /**
         * The value it should be filled with
         * @type {*|string}
         */
        this.value = obj.value || '';
    }

    /**
     * The string representation of the action
     * @returns {string}
     */
    toString() {
        return `Fill input "${this.node}" with "${this.value}"`;
    };
}

export default FillWebAction;