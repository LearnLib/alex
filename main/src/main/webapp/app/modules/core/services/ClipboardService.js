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
         * @param {string} key
         * @param {*} data
         */
        Clipboard.prototype.copy = function (key, data) {
            this.entries[key] = {
                data: data,
                mode: 'copy'
            }
        };

        /**
         * @param {string} key
         * @param {*} data
         */
        Clipboard.prototype.cut = function (key, data) {
            this.entries[key] = {
                data: data,
                mode: 'cut'
            }
        };

        /**
         * @param {string} key
         * @returns {*|null}
         */
        Clipboard.prototype.paste = function (key) {
            if (this.entries[key]) {
                var data = this.entries[key].data;
                if (this.entries[key].mode === 'cut') {
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