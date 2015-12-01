import Action from '../Action';
import {actionType} from '../../../constants';

/** Sets a variable to a specific value and implicitly initializes it if it has not been created before */
class SetVariableByCookieAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.GENERAL_SET_VARIABLE_BY_COOKIE, obj);

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

        /**
         * The type of the cookie (REST|WEB)
         * @type {string}
         */
        this.cookieType = obj.cookieType || 'WEB';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Set variable "' + this.name + '" to the value of the cookie: "' + this.value + '"';
    }
}

export default SetVariableByCookieAction;