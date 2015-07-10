(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('GoToWebAction', GoToWebActionFactory);

    GoToWebActionFactory.$inject = ['AbstractAction', 'actionGroupTypes', 'actionTypes'];

    /**
     * The factory for GoToWebAction
     *
     * @param ActionService
     * @param AbstractAction
     * @param actionGroupTypes
     * @param actionTypes
     * @returns {GoToWebAction}
     * @constructor
     */
    function GoToWebActionFactory(AbstractAction, actionGroupTypes, actionTypes) {

        /**
         * Goes to a URL
         *
         * @param {string} url - The url that is called
         * @constructor
         */
        function GoToWebAction(url) {
            AbstractAction.call(this, actionTypes[actionGroupTypes.WEB].GO_TO);
            this.url = url || null;
        }

        GoToWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        GoToWebAction.prototype.toString = function () {
            return 'Go to URL "' + this.url + '"';
        };

        return GoToWebAction;
    }
}());
