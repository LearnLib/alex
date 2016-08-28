import {Action} from "../Action";
import {actionType} from "../../../constants";

/**
 * Action to press a key on the keyboard.
 */
export class PressKeyAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WEB_PRESS_KEY, obj);

        /**
         * The CSS selector of an element.
         * @type {*|string}
         */
        this.node = obj.node || null;

        /**
         * The unicode of the key to press.
         * @type {*|string}
         */
        this.key = obj.key || '';
    }

    /**
     * Get the string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return 'Press a key';
    }
}