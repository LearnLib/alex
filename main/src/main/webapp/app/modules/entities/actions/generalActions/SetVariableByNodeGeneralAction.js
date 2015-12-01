import Action from '../Action';
import {actionType} from '../../../constants';

/** Extracts the text content value of an element and saves it value in a variable */
class SetVariableByNodeGeneralAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.GENERAL_SET_VARIABLE_BY_HTML, obj);

        /**
         * The name of the variable
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The selector of the node
         * @type {*|string}
         */
        this.value = obj.value || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Set variable "' + this.name + '" to the value of the element "' + this.value + '"';
    }
}

export default SetVariableByNodeGeneralAction;