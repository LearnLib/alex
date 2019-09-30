/*
 * Copyright 2015 - 2019 TU Dortmund
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

import { environment as env } from '../../../environments/environment';
import { User } from '../../entities/user';
import { IHttpService, IPromise } from 'angular';

/**
 * The resource to handle actions with users over the API.
 */
export class UserResource {

  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Changes the password of a user.
   *
   * @param user The user whose password should be changed.
   * @param oldPassword The old password.
   * @param newPassword The new password.
   * @returns A promise.
   */
  changePassword(user: User, oldPassword: string, newPassword: string): IPromise<any> {
    return this.$http.put(`${env.apiUrl}/users/${user.id}/password`, {oldPassword, newPassword});
  }

  /**
   * Changes the email of a user.
   *
   * @param user The user whose email should be changed.
   * @param email The new email.
   * @returns A promise.
   */
  changeEmail(user: User, email: string): IPromise<any> {
    return this.$http.put(`${env.apiUrl}/users/${user.id}/email`, {email})
      .then(response => User.fromData(response.data));
  }

  /**
   * Gets a single user by its id.
   *
   * @param userId The id of the user to get.
   * @returns A promise.
   */
  get(userId: number): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/users/${userId}`)
      .then(response => User.fromData(response.data));
  }

  /**
   * Gets a list of all users. Should only be called by admins.
   *
   * @returns A promise.
   */
  getAll(): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/users`)
      .then(res => (<any[]>res.data).map(u => User.fromData(u)));
  }

  /**
   * Creates a new user.
   *
   * @param user he user to create.
   * @returns A promise.
   */
  create(user: User): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/users`, user);
  }

  /**
   * Logs in a user.
   *
   * @param email The email of the user.
   * @param password The password of the user.
   * @returns A promise.
   */
  login(email: string, password: string): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/users/login`, {email, password});
  }

  /**
   * Removes a user.
   *
   * @param user the user to remove.
   * @returns The promise.
   */
  remove(user: User): IPromise<any> {
    return this.$http.delete(`${env.apiUrl}/users/${user.id}`, {});
  }

  /**
   * Deletes the users with the specified ids.
   *
   * @param userIds The ids of the users to delete.
   * @returns The promise.
   */
  removeManyUsers(userIds: number[]): IPromise<any> {
    return this.$http.delete(`${env.apiUrl}/users/batch/${userIds.join(',')}`);
  }

  /**
   * Gives a registered user admin rights.
   *
   * @param user The user to promote.
   * @returns The promise.
   */
  promote(user: User): IPromise<any> {
    return this.$http.put(`${env.apiUrl}/users/${user.id}/promote`, {})
      .then(response => User.fromData(response.data));
  }

  /**
   * Takes the admin rights of a user.
   *
   * @param user The user to demote.
   * @returns The promise.
   */
  demote(user: User): IPromise<any> {
    return this.$http.put(`${env.apiUrl}/users/${user.id}/demote`, {})
      .then(response => User.fromData(response.data));
  }
}
