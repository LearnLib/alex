(function () {
    'use strict';

    /** The factory for the Clipboard */
    class ClipboardService {

        /** Constructor */
        constructor() {

            /**
             * The map of clipboard entries
             * @type {Map}
             */
            this.entries = new Map();
        }

        /**
         * Copies an item to the Clipboard
         * @param {string} key - The key the data is saved under
         * @param {any} data - the data to copy to the clipboard
         */
        copy(key, data) {
            this.entries.set(key, {
                data: data,
                mode: 'copy'
            });
        }

        /**
         * Cuts an item to the clipboard
         * @param {string} key - The key under which the data is accessed
         * @param {any} data - The data to store
         */
        cut(key, data) {
            this.entries.set(key, {
                data: data,
                mode: 'cut'
            });
        }

        /**
         * Pastes an item from the clipboard. Deletes the item if mode has been 'cut'
         * @param {string} key - The key whose data to get
         * @returns {any|null}
         */
        paste(key) {
            if (this.entries.has(key)) {
                const item = this.entries.get(key);
                const data = item.data;
                if (item.mode === 'cut') {
                    this.entries.delete(key);
                }
                return data;
            } else {
                return null;
            }
        }
    }

    angular
        .module('ALEX.services')
        .factory('ClipboardService', () => new ClipboardService());
}());