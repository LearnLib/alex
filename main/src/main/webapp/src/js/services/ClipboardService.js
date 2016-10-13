/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The factory for the Clipboard.
 */
export class ClipboardService {

    /**
     * Constructor.
     */
    constructor() {

        /**
         * The map of clipboard entries.
         * @type {Map}
         */
        this.entries = new Map();
    }

    /**
     * Copies an item to the Clipboard.
     *
     * @param {string} key - The key the data is saved under.
     * @param {any} data - the data to copy to the clipboard.
     */
    copy(key, data) {
        this.entries.set(key, {
            data: data,
            mode: 'copy'
        });
    }

    /**
     * Cuts an item to the clipboard.
     *
     * @param {string} key - The key under which the data is accessed.
     * @param {any} data - The data to store.
     */
    cut(key, data) {
        this.entries.set(key, {
            data: data,
            mode: 'cut'
        });
    }

    /**
     * Pastes an item from the clipboard. Deletes the item if mode has been 'cut'.
     *
     * @param {string} key - The key whose data to get.
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