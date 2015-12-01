import Action from '../Action';
import {actionType} from '../../../constants';

/** Sets a variable to a specific value and implicitly initializes it if it has not been created before */
class IncrementCounterGeneralAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.GENERAL_INCREMENT_COUNTER, obj);

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
