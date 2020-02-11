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

export enum UserRole {
  REGISTERED = 'REGISTERED',
  ADMIN = 'ADMIN'
}

/** The model for user api results. */
export class User {

  /** The id of the user. */
  public id: number;

  /** The role of the user. */
  public role: UserRole;

  /** The email of the user. */
  public email: string;

  /** The username of the user. */
  public username: string;

  // /** List of project ids the user is owner **/
  // public projectsOwner: number[];
  //
  // /** List of project ids the user is member **/
  // public projectsMember: number[];

  constructor() {
    this.role = UserRole.REGISTERED;
  }

  static fromData(data: any): User {
    const u = new User();
    u.id = data.id;
    u.role = data.role;
    u.email = data.email;
    u.username = data.username;
    // u.projectsOwner = data.projectsOwner;
    // u.projectsMember = data.projectsMember;
    return u;
  }

  copy(): User {
    return User.fromData(JSON.parse(JSON.stringify(this)));
  }
}
