(function () {
    'use strict';

    angular
        .module('ALEX.services')
        .factory('SessionService', SessionService);

    SessionService.$inject = ['$rootScope', 'Project'];

    /**
     * The session that is used in this application to save data in the session storage of the browser to store data in
     * between page refreshes in the same tab. So the project doesn't have to be fetched from the server every time the
     * page refreshes
     *
     * @param $rootScope
     * @param Project
     * @return {{project: {get: getProject, save: saveProject, remove: removeProject}}}
     * @constructor
     */
    function SessionService($rootScope, Project) {

        // the service
        return {
            project: {
                get: getProject,
                save: saveProject,
                remove: removeProject
            }
        };

        /**
         * Get the stored project object from the session storage
         *
         * @return {Project}
         */
        function getProject() {
            var project = angular.fromJson(sessionStorage.getItem('project'));
            return project === null ? null : Project.build(project);
        }

        /**
         * Save a project into the session storage end emit the 'project.opened' event
         *
         * @param project
         */
        function saveProject(project) {
            sessionStorage.setItem('project', angular.toJson(project));
            $rootScope.$broadcast('project.opened');
        }

        /**
         * Remove the stored project from session storage an emit the 'project.closed' event
         */
        function removeProject() {
            sessionStorage.removeItem('project');
            $rootScope.$broadcast('project.closed');
        }
    }
}());