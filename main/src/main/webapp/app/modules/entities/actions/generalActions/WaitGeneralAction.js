import Action from '../Action';

/** Wait for a certain amount of time before executing the next action */
class WaitGeneralAction extends Action {
    static get type() {
        return 'wait';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(WaitGeneralAction.type);

        /**
         * The time to wait in milliseconds
         * @type {*|number}
         */
        this.duration = obj.duration || 0;
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Wait for ' + this.duration + 'ms';
    }
}

export default WaitGeneralAction;
