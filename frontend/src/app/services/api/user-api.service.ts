/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { User, UserRole } from '../../entities/user';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentProvider } from '../../../environments/environment.provider';

/**
 * The resource to handle actions with users over the API.
 */
@Injectable()
export class UserApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Changes the password of a user.
   *
   * @param user The user whose password should be changed.
   * @param oldPassword The old password.
   * @param newPassword The new password.
   * @returns A promise.
   */
  changePassword(user: User, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.env.apiUrl}/users/${user.id}/password`, {
      oldPassword,
      newPassword
    }, this.defaultHttpOptions);
  }

  /**
   * Changes the email of a user.
   *
   * @param user The user whose email should be changed.
   * @param email The new email.
   * @returns A promise.
   */
  changeEmail(user: User, email: string): Observable<User> {
    return this.http.put(`${this.env.apiUrl}/users/${user.id}/email`, {email}, this.defaultHttpOptions)
      .pipe(
        map((body: any) => User.fromData(body))
      );
  }

  /**
   * Changes the username of the user.
   *
   * @param user The user whose username should be changed.
   * @param username The new username.
   */
  changeUsername(user: User, username: string): Observable<User> {
    return this.http.put(`${this.env.apiUrl}/users/${user.id}/username`, {username}, this.defaultHttpOptions)
      .pipe(
        map((body: any) => User.fromData(body))
      );
  }

  changeRole(user: User, role: UserRole): Observable<User> {
    return this.http.put(`${this.env.apiUrl}/users/${user.id}/role`, {role}, this.defaultHttpOptions)
      .pipe(
        map((body: any) => User.fromData(body))
      );
  }

  /**
   * Gets a single user by its id.
   *
   * @param userId The id of the user to get.
   * @returns A promise.
   */
  get(userId: number): Observable<User> {
    return this.http.get(`${this.env.apiUrl}/users/${userId}`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => User.fromData(body))
      );
  }

  /**
   * Gets multiple users by their ids.
   *
   * @param userIds The ids of the users to get.
   */
  getManyUsers(userIds: number[]): Observable<User[]> {
    return this.http.get(`${this.env.apiUrl}/users/batch/${userIds.join(',')}`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(u => User.fromData(u)))
      );
  }

  getByUsernameOrEmail(searchterm: string): Observable<User[]> {
    return this.http.get(`${this.env.apiUrl}/users/search`, {headers: this.defaultHttpHeaders, params: {searchterm}})
      .pipe(
        map((body: any) => body.map(u => User.fromData(u)))
      );
  }

  /**
   * Gets a list of all users. Should only be called by admins.
   *
   * @returns A promise.
   */
  getAll(): Observable<User[]> {
    return this.http.get(`${this.env.apiUrl}/users`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(u => User.fromData(u)))
      );
  }

  /**
   * Creates a new user.
   *
   * @param user he user to create.
   * @returns A promise.
   */
  create(user: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/users`, user, this.defaultHttpOptions).pipe(
      map((body: any) => User.fromData(body))
    );
  }

  /**
   * Logs in a user.
   *
   * @param email The email of the user.
   * @param password The password of the user.
   * @returns A promise.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/users/login`, {email, password}, this.defaultHttpOptions);
  }

  /**
   * Removes a user.
   *
   * @param user the user to remove.
   * @returns The promise.
   */
  remove(user: User): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/users/${user.id}`, this.defaultHttpOptions);
  }

  /**
   * Deletes the users with the specified ids.
   *
   * @param userIds The ids of the users to delete.
   * @returns The promise.
   */
  removeManyUsers(userIds: number[]): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/users/batch/${userIds.join(',')}`, this.defaultHttpOptions);
  }

  myself(): Observable<User> {
    return this.http.get(`${this.env.apiUrl}/users/myself`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => User.fromData(body))
      );
  }
}
