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

/** The form model for a Project */
class ProjectFormModel {

    /**
     * Constructor
     * @param {string} name - The name of the project
     * @param {string} baseUrl - The base URL of the project
     * @param {string|null} description - The description of the project
     * @constructor
     */
    constructor(name = '', baseUrl = '', description = null) {
        this.name = name;
        this.baseUrl = baseUrl;
        this.description = description;
    }
}

/** The api result model for a Project */
class Project extends ProjectFormModel {

    /**
     * Constructor
     * @param {object} obj - The object to create a project from
     */
    constructor(obj) {
        super(obj.name, obj.baseUrl, obj.description);

        /**
         * The id of the project
         * @type {number}
         */
        this.id = obj.id;

        /**
         * The id of the user the project belongs to
         * @type{number}
         */
        this.user = obj.user;
    }
}

export {ProjectFormModel, Project};