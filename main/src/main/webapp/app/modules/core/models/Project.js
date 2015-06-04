(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .factory('Project', ProjectFactory);

    ProjectFactory.$inject = ['_'];

    /**
     * The factory for the model of a project.
     *
     * @param _ - Lodash
     * @returns {Project}
     * @constructor
     */
    function ProjectFactory(_) {

        /**
         * The model for a Project
         *
         * @param {string} name - The name of the project
         * @param {string} baseUrl - The base URL of the project
         * @param {string} description - The description of the project
         * @constructor
         */
        function Project(name, baseUrl, description){
            this.name = name || null;
            this.baseUrl = baseUrl || null;
            this.description = description || null;
        }

        /**
         * Create an instance of Project from an object
         *
         * @param {Object} data - The object the project is created from
         * @returns {Project}
         */
        Project.build = function(data){
            return angular.extend(new Project(
                data.name,
                data.baseUrl,
                data.description
            ), {
                id: data.id
            });
        };

        /**
         * Create [an] instance[s] of Project from a HTTP response
         *
         * @param {Object} response - The response object from the API
         * @returns {Project|Project[]} - The Project[s]
         */
        Project.transformApiResponse = function(response){
            if (angular.isArray(response.data)) {
                if (response.data.length > 0) {
                    return _.map(response.data, Project.build);
                } else {
                    return [];
                }
            } else {
                return Project.build(response.data);
            }
        };

        return Project;
    }
}());