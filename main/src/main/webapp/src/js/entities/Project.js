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
 * The api result model for a project.
 */
export class Project {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create a project from.
     */
    constructor(obj = {}) {

        /**
         * The name of the project.
         * @type {string}
         */
        this.name = obj.name || null;

        /**
         * The base URL of the project.
         * @type {string}
         */
        this.baseUrl = obj.baseUrl || null;

        /**
         * The description of the project.
         * @type {string}
         */
        this.description = obj.description || null;

        /**
         * The id of the project.
         * @type {number}
         */
        this.id = obj.id;

        /**
         * The id of the user the project belongs to.
         * @type{number}
         */
        this.user = obj.user;

        /**
         * The URLs of the mirrors of the application
         * @type {string[]}
         */
        this.mirrorUrls = obj.mirrorUrls || [];
    }
}