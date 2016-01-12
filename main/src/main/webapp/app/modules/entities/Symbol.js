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

import ActionService from '../services/ActionService';

const actionService = new ActionService();

/** The model for the symbol create form */
class SymbolFormModel {

    /**
     * Constructor
     * @param {string} name - The unique name of the symbol
     * @param {string} abbreviation - The unique abbreviation of the symbol
     * @param {number} group - The id of the group the symbol should be created in
     */
    constructor(name = '', abbreviation = '', group = 0) {
        this.name = name;
        this.abbreviation = abbreviation;
        this.group = group;
        this.actions = [];
    }
}


/** The symbol model */
class Symbol extends SymbolFormModel {

    /**
     * Constructor
     * @param {object} obj - The object to create the symbol from
     */
    constructor(obj) {
        super(obj.name, obj.abbreviation);

        /**
         * The id of the symbol
         * @type {number}
         */
        this.id = obj.id;

        /**
         * The revision of the symbol
         * @type {number}
         */
        this.revision = obj.revision;

        /**
         * The id of the project the symbol belongs to
         * @type {number}
         */
        this.project = obj.project;

        /**
         * The id of the group the symbol belongs to
         * @type {number}
         */
        this.group = obj.group;

        /**
         * The id of the user the symbol belongs to
         * @type {number}
         */
        this.user = obj.user;

        /**
         * The flag if the symbol has been deleted
         * @type {boolean}
         */
        this.hidden = obj.hidden;

        /**
         * The actions of the symbol
         * @type {Action[]}
         */
        this.actions = obj.actions.map(action => actionService.create(action));
    }

    /**
     * Gets the number of enabled actions
     * @returns {number}
     */
    countEnabledActions() {
        return this.actions.filter(action => !action.disabled).length;
    }

    /**
     * Gets the symbol as id revision pair
     * @returns {{id: number, revision: number}}
     */
    getIdRevisionPair() {
        return {
            id: this.id,
            revision: this.revision
        };
    }

    /**
     * Gets a reduced version of the symbol that can be used to export it
     * @returns {{name: *, abbreviation: *, actions: Action[]}}
     */
    getExportableSymbol() {
        return {
            name: this.name,
            abbreviation: this.abbreviation,
            actions: this.actions
        };
    }
}

export {SymbolFormModel, Symbol};