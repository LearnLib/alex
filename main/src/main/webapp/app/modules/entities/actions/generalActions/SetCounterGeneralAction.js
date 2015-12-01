import Action from '../Action';
import {actionType} from '../../../constants';

/** Sets a variable to a specific value and implicitly initializes it if it has not been created before */
class SetCounterGeneralAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.GENERAL_SET_COUNTER, obj);

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