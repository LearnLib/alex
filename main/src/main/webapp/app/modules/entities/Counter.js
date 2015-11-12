/** The counter model */
class Counter {

    /**
     * Constructor
     * @param {object} obj - The object to create a counter from
     */
    constructor(obj) {

        /**
         * The name of the counter
         * @type {string}
         */
        this.name = obj.name;

        /**
         * The value of the counter
         * @type {number}
         */
        this.value = obj.value;

        /**
         * The id of the project
         * @type {number}
         */
        this.project = obj.project;
    }
}

export default Counter;