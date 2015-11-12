import Action from '../Action';

/** Sets a variable to a specific value and implicitly initializes it if it has not been created before */
class IncrementCounterGeneralAction extends Action {
    static get type() {
        return 'incrementCounter';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(IncrementCounterGeneralAction.type);

        /**
         * The name of the counter
         * @type {*|string}
         */
        this.name = obj.name || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Increment counter "' + this.name + '"';
    }
}

export default IncrementCounterGeneralAction;
