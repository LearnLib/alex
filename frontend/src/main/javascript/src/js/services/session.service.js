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

import {events} from '../constants';
import {Project} from '../entities/project';
import {User} from '../entities/user';

/**
 * The session that is used in this application to save data in the session storage of the browser to store data in
 * between page refreshes in the same tab. So the project doesn't have to be fetched from the server every time the
 * page refreshes.
 */
export class SessionService {

    /**
     * Constructor.
     *
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor(EventBus) {
        this.EventBus = EventBus;
    }

    /**
     * Get the stored project object from the session storage.
     *
     * @return {Project}
     */
    getProject() {
        const project = sessionStorage.getItem('project');
        return project === null ? null : new Project(JSON.parse(project));
    }

    /**
     * Save a project into the session storage end emit the 'project.opened' event.
     *
     * @param {Project} project - The project to save in the sessionStorage.
     */
    saveProject(project) {
        sessionStorage.setItem('project', JSON.stringify(project));
        this.EventBus.emit(events.PROJECT_OPENED, {project: project});
    }

    /**
     * Remove the stored project from session storage an emit the 'project.closed' event.
     */
    removeProject() {
        sessionStorage.removeItem('project');
    }

    /**
     * Gets the instance of the user that is logged in.
     */
    getUser() {
        const user = sessionStorage.getItem('user');
        return user === null ? null : new User(JSON.parse(user));
    }

    /**
     * Saves the user in the session
     *
     * @param {User} user - The user to save in the sessionStorage.
     * @param {object|null} jwt - The jwt to save in the sessionStorage.
     */
    saveUser(user, jwt = null) {
        sessionStorage.setItem('user', JSON.stringify(user));
        if (jwt) sessionStorage.setItem('jwt', jwt);
        this.EventBus.emit(events.USER_LOGGED_IN, {user: user});
    }

    /**
     * Removes the user and its jwt from the session storage.
     */
    removeUser() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('jwt');
    }
}
