(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .factory('ClipboardService', ClipboardService);

    /**
     * The factory for the Clipboard
     *
     * @returns {Clipboard}
     * @constructor
     */
    function ClipboardService() {

        /**
         * The Clipboard
         * @constructor
         */
        function Clipboard() {

            /**
             * The map of clipboard entries
             * @type {{}}
             */
            this.entries = {}
        }

        /**
         * The enum with clipboard modes.
         * CUT  - An object is only pasted once and then removed from clipboard
         * COPY - An object stays in the clipboard after pasting
         * @type {{CUT: number, COPY: number}}
         */
        Clipboard.modes = {
            CUT: 0,
            COPY: 1
        };

        /**
         * @param {string} key
         * @param {*} data
         */
        Clipboard.prototype.copy = function (key, data) {
            this.entries[key] = {
                data: data,
                mode: Clipboard.modes.COPY
            }
        };

        /**
         * @param {string} key
         * @param {*} data
         */
        Clipboard.prototype.cut = function (key, data) {
            this.entries[key] = {
                data: data,
                mode: Clipboard.modes.CUT
            }
        };

        /**
         * @param {string} key
         * @returns {*|null}
         */
        Clipboard.prototype.paste = function (key) {
            if (angular.isDefined(this.entries[key])) {
                var data = this.entries[key].data;
                if (this.entries[key].mode === Clipboard.modes.CUT) {
                    delete this.entries[key];
                }
                return data;
            } else {
                return null;
            }
        };

        return new Clipboard();
    }
}());