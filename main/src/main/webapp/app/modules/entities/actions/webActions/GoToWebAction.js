import Action from '../Action';
import {actionType} from '../../../constants';

/** Opens a URL */
class GoToWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.WEB_GO_TO, obj);

        /**
         * The url that is called
         * @type {*|string}
         */
        this.url = obj.url || '';
    }

    /**
     * The string representation of the action
     * @returns {string}
     */
    toString() {
        return `Open URL "${this.url}"`;
    }
}

export default GoToWebAction;