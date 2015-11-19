import Action from '../Action';

/** Checks for the status code (e.g. 404) in an HTTP response */
class CheckStatusRestAction extends Action {
    static get type() {
        return 'rest_checkStatus';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(CheckStatusRestAction.type, obj);

        /**
         * The status code
         * @type {*|number}
         */
        this.status = obj.status || 200;
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Check HTTP response status to be "' + this.status + '"';
    };
}

export default CheckStatusRestAction;