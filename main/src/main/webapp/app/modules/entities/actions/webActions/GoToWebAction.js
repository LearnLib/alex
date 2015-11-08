(function () {
    'use strict';

    angular
        .module('ALEX.entities')
        .factory('GoToWebAction', factory);

    /**
     * @param AbstractAction
     * @returns {GoToWebAction}
     */
    // @ngInject
    function factory(AbstractAction) {

        /**
         * Goes to a URL
         *
         * @param {string} url - The url that is called
         * @constructor
         */
        function GoToWebAction(url) {
            AbstractAction.call(this, GoToWebAction.type);
            this.url = url || null;
        }

        GoToWebAction.prototype = Object.create(AbstractAction.prototype);

        /**
         * @returns {string}
         */
        GoToWebAction.prototype.toString = function () {
            return 'Open URL "' + this.url + '"';
        };

        GoToWebAction.type = 'web_goto';

        return GoToWebAction;
    }
}());
