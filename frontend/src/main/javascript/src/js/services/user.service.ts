/*
 * Copyright 2018 TU Dortmund
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

import {User} from '../entities/user';
import {ClipboardService} from './clipboard.service';
import {ProjectService} from './project.service';

export interface UserStore {
  currentUser?: User,
  jwt?: string
}

export class UserService {

  /** The store. */
  public store: UserStore;

  /**
   * Constructor.
   *
   * @param projectService
   * @param clipboardService
   */
  /* @ngInject */
  constructor(private projectService: ProjectService,
              private clipboardService: ClipboardService) {

    this.store = {
      currentUser: null,
      jwt: null,
    };

    // load user from session
    const userInSession = localStorage.getItem('user');
    if (userInSession != null) {
      this.store.currentUser = new User(JSON.parse(userInSession));
      const jwtInSession = localStorage.getItem('jwt');
      if (jwtInSession != null) {
        this.store.jwt = jwtInSession;
      }
    }
  }

  /**
   * Saves the current user in the local storage.
   *
   * @param user The user that logged in.
   * @param jwt The jwt.
   */
  login(user: User, jwt: string = null) {
    this.clipboardService.clear();
    localStorage.setItem('user', JSON.stringify(user));
    this.store.currentUser = user;
    if (jwt) {
      localStorage.setItem('jwt', jwt);
      this.store.jwt = jwt;
    }
  }

  /** Removes all user related data from the session. */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.store.currentUser = null;
    this.store.jwt = null;
    this.projectService.reset();
    this.clipboardService.clear();
  }
}
