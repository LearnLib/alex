import Action from '../Action';
import {actionType} from '../../../constants';

/**
 * Checks in a HTTP response body that is formatted in JSON if a specific attribute exists.
 * E.g. object.attribute.anotherAttribute
 */
class CallRestAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.REST_CALL, obj);

        /**
         * The HTTP method in {GET,POST,PUT,DELETE}
         * @type {*|string}
         */
        this.method = obj.method || 'GET';

        /**
         * The URL the request is send to
         * @type {*|string}
         */
        this.url = obj.url || '';

        /**
         * The body data for POST and PUT requests
         * @type {*|null}
         */
        this.data = obj.data || null;

        /**
         * The cookies to send with the request
         * @type {{}}
         */
        this.cookies = obj.cookies || {};

        /**
         * The HTTP headers of the request
         * @type {*|{}}
         */
        this.headers = obj.headers || {};
    }

    /**
     * Adds a cookie to the action
     *
     * @param {string} key - The cookie key
     * @param {string} value - The cookie value
     */
    addCookie(key, value) {
        this.cookies[key] = value;
    }

    /**
     * Removes a cookie from the action
     *
     * @param {string} key - The key of the cookie
     */
    removeCookie(key) {
        if (angular.isDefined(this.cookies[key])) {
            delete this.cookies[key];
        }
    }

    /**
     * Adds a header field entry to the action
     *
     * @param {string} key - The Http header field name
     * @param {string} value - The Http header field value
     */
    addHeader(key, value) {
        this.headers[key] = value;
    }

    /**
     * Removes a header field entry
     *
     * @param {string} key - The key of the Http header entry
     */
    removeHeader(key) {
        if (angular.isDefined(this.headers[key])) {
            delete this.headers[key];
        }
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Make a ' + this.method + ' request to "' + this.url + '"';
    }
}

export default CallRestAction;