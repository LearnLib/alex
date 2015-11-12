import Action from '../Action';

/** Extracts the text content value of an element and saves it value in a variable */
class SetVariableByJsonAttributeGeneralAction extends Action {
    static get type() {
        return 'setVariableByJSON';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(SetVariableByJsonAttributeGeneralAction.type);

        /**
         * The name of the variable
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The JSON property
         * @type {string}
         */
        this.value = obj.value || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Set variable "' + this.name + '" to the value of the JSON attribute "' + this.value + '"';
    }
}

export default SetVariableByJsonAttributeGeneralAction;