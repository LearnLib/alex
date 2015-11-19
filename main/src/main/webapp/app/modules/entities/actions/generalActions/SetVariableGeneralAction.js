import Action from '../Action';

/** Sets a variable to a specific value and implicitly initializes it if it has not been created before */
class SetVariableGeneralAction extends Action {
    static get type() {
        return 'setVariable';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(SetVariableGeneralAction.type, obj);

        /**
         * The name of the variable
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The value of the variable
         * @type {*|string}
         */
        this.value = obj.value || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Set variable "' + this.name + '" to "' + this.value + '"';
    }
}

export default SetVariableGeneralAction;