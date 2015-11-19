import Action from '../Action';

/** Extracts the text content value of an element and saves it value in a variable */
class SetVariableByNodeGeneralAction extends Action {
    static get type() {
        return 'setVariableByHTML';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(SetVariableByNodeGeneralAction.type, obj);

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