import Action from '../Action';

/** Searches for a piece of text or a regular expression in the HTML document */
class CheckForTextWebAction extends Action {
    static get type() {
        return 'web_checkForText';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(CheckForTextWebAction.type, obj);

        /**
         * The piece of text to look for
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * Whether the value is a regular expression
         * @type {*|boolean}
         */
        this.regexp = obj.regexp || false;
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        if (this.regexp) {
            return 'Check if the document matches "' + this.value + '"';
        } else {
            return 'Search for "' + this.value + '" in the document';
        }
    };
}

export default CheckForTextWebAction;