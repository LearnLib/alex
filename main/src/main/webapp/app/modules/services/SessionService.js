/**
 * The session that is used in this application to save data in the session storage of the browser to store data in
 * between page refreshes in the same tab. So the project doesn't have to be fetched from the server every time the
 * page refreshes
 *
 * @param $rootScope
 * @param Project
 * @param User
 * @returns {{project: {get: getProject, save: saveProject, remove: removeProject}, user: {get: getUser, save: saveUser, remove: removeUser}}}
 * @constructor
 */
// @ngInject
function SessionService($rootScope, Project, User) {
    return {
        project: {
            get: getProject,
            save: saveProject,
            remove: removeProject
        },
        user: {
            get: getUser,
            save: saveUser,
            remove: removeUser
        }
    };

    /**
     * Get the stored project object from the session storage
     *
     * @return {Project}
     */
    function getProject() {
        var project = sessionStorage.getItem('project');
        return project === null ? null : new Project(angular.fromJson(project));
    }

    /**
     * Save a project into the session storage end emit the 'project.opened' event
     *
     * @param project
     */
    function saveProject(project) {
        sessionStorage.setItem('project', angular.toJson(project));
        $rootScope.$emit('project:opened', project);
    }

    /**
     * Remove the stored project from session storage an emit the 'project.closed' event
     */
    function removeProject() {
        sessionStorage.removeItem('project');
        $rootScope.$emit('project:closed');
    }


    function getUser() {
        var user = sessionStorage.getItem('user');
        return user === null ? null : new User(angular.fromJson(user));
    }

    function saveUser(user) {
        sessionStorage.setItem('user', angular.toJson(user));
        $rootScope.$emit('user:loggedIn', user);
    }

    function removeUser() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('jwt');
        $rootScope.$emit('user:loggedOut');
    }
}

export default SessionService;