import Action from '../Action';
import {actionType} from '../../../constants';

/** Selects an entry from a select box */
class SelectWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.WEB_SELECT, obj);

        /**
         * The CSS selector of an select element
         * @type {*|string}
         */
        this.node = obj.node || '';

        /**
         * The value of the select input that should be selected
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * The type the option is selected by {'TEXT', 'VALUE', 'INDEX'}
         * @type {string}
         */
        this.selectBy = obj.selectBy || 'TEXT';
    }

    /**
     * Get the string representation of the action
     * @returns {string}
     */
    toString() {
        return 'Select value "' + this.value + '" from select input "' + this.node + '"';
    }
}

export default SelectWebAction;