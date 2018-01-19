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

import {AlphabetSymbol} from './alphabet-symbol';

/**
 * The model for symbol group.
 */
export class SymbolGroup {

    /**
     * Constructor.
     *
     * @param {*} obj - The object to create the symbol group from.
     */
    constructor(obj = {}) {

        /**
         * The name of the group.
         * @type {string}
         */
        this.name = obj.name || null;

        /**
         * The id of the group.
         * @type {number}
         */
        this.id = obj.id;

        /**
         * The id of the project the group belongs to.
         * @type {number}
         */
        this.project = obj.project;

        /**
         * The visible symbols of the group.
         * @type {AlphabetSymbol[]}
         */
        this.symbols = obj.symbols ? obj.symbols.filter(s => !s.hidden).map(s => new AlphabetSymbol(s)) : [];
    }
}
