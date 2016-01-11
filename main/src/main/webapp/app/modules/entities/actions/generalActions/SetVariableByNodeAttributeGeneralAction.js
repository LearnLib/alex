import Action from '../Action';
import {actionType} from '../../../constants';

/** Extracts the text content value of an element and saves it value in a variable */
class SetVariableByNodeAttributeGeneralAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.GENERAL_SET_VARIABLE_BY_NODE_ATTRIBUTE, obj);

        /**
         * The name of the variable
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The selector of the node
         * @type {*|string}
         */
        this.node = obj.node || '';

        /**
         * The attribute of the element
         * @type {string}
         */
        this.attribute = obj.attribute || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return `Set variable "${this.name}" to the value of the attribute "${this.attribute}" of the element "${this.node}"`;
    }
}

export default SetVariableByNodeAttributeGeneralAction;