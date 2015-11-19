import Action from '../Action';

/** Opens a URL */
class GoToWebAction extends Action {
    static get type() {
        return 'web_goto';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(GoToWebAction.type, obj);

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
    };
}

export default GoToWebAction;