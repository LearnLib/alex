import Action from '../Action';

/** Sets a variable to a specific value and implicitly initializes it if it has not been created before */
class SetCounterGeneralAction extends Action {
    static get type() {
        return 'setCounter';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(SetCounterGeneralAction.type, obj);

        /**
         * The name of the counter
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The value of the counter
         * @type {*|string}
         */
        this.value = obj.value || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Set counter "' + this.name + '" to "' + this.value + '"';
    }
}

export default SetCounterGeneralAction;