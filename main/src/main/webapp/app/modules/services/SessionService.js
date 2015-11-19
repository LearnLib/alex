import {events} from '../constants';
import {User} from '../entities/User';
import {Project} from '../entities/Project';

/**
 * The session that is used in this application to save data in the session storage of the browser to store data in
 * between page refreshes in the same tab. So the project doesn't have to be fetched from the server every time the
 * page refreshes
 *
 * @param EventBus
 * @returns {{project: {get: getProject, save: saveProject, remove: removeProject}, user: {get: getUser, save: saveUser, remove: removeUser}}}
 * @constructor
 */
// @ngInject
function SessionService(EventBus) {
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
     * @return {Project}
     */
    function getProject() {
        const project = sessionStorage.getItem('project');
        return project === null ? null : new Project(angular.fromJson(project));
    }

    /**
     * Save a project into the session storage end emit the 'project.opened' event
     * @param {Project} project
     */
    function saveProject(project) {
        sessionStorage.setItem('project', angular.toJson(project));
        EventBus.emit(events.PROJECT_OPENED, {project: project});
    }

    /** Remove the stored project from session storage an emit the 'project.closed' event */
    function removeProject() {
        sessionStorage.removeItem('project');
    }

    /** Gets the instance of the user that is logged in **/
    function getUser() {
        const user = sessionStorage.getItem('user');
        return user === null ? null : new User(angular.fromJson(user));
    }

    /**
     * Saves the user in the session
     * @param {User} user
     */
    function saveUser(user) {
        sessionStorage.setItem('user', angular.toJson(user));
        EventBus.emit(events.USER_LOGGED_IN, {user: user});
    }

    /** Removes the user and its jwt from the session storage */
    function removeUser() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('jwt');
    }
}

export default SessionService;