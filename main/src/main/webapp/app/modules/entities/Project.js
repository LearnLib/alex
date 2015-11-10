(function () {
    'use strict';

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
            this.description = description
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

    angular
        .module('ALEX.entities')
        .factory('ProjectFormModel', () => ProjectFormModel)
        .factory('Project', () => Project);
}());