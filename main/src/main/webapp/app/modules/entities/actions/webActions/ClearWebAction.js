import Action from '../Action';

/** Remove all inputs from an element */
class ClearWebAction extends Action {
    static get type() {
        return 'web_clear';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(ClearWebAction.type, obj);

        /**
         * The CSS selector of an element
         * @type {*|string}
         */
        this.node = obj.node || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return `Clear input "${this.node}"`;
    };
}

export default ClearWebAction;