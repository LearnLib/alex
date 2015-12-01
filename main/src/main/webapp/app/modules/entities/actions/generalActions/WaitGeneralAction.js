import Action from '../Action';
import {actionType} from '../../../constants';

/** Wait for a certain amount of time before executing the next action */
class WaitGeneralAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.GENERAL_WAIT, obj);

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
