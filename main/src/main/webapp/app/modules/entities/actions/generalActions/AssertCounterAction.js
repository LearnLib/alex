import Action from '../Action';

/** Action to compare the value of a counter to another integer value */
class AssertCounterAction extends Action {
    static get type() {
        return 'assertCounter';
    }

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(AssertCounterAction.type);

        /**
         * The name of the counter
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The value to compare the content with
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * The operator to compare two integer values
         * @type {*|string}
         */
        this.operator = obj.operator || 'EQUAL';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        let s;

        switch (this.operator) {
            case 'LESS_THAN':
                s = 'less than';
                break;
            case 'LESS_OR_EQUAL':
                s = 'less or equal to';
                break;
            case 'EQUAL':
                s = 'equal to';
                break;
            case 'GREATER_OR_EQUAL':
                s = 'greater or equal to';
                break;
            case 'GREATER_THAN':
                s = 'greater than';
                break;
            default:
                s = 'undefined';
                break;
        }

        return 'Check if counter "' + this.name + '" is ' + s + ' ' + this.value;
    }
}

export default AssertCounterAction;
