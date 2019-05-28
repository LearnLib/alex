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

export interface ProjectUrl {
  id?: number,
  name?: string,
  url: string,
  default: boolean
}

/**
 * The api result model for a project.
 */
export class Project {

  /** The name of the project. */
  public name: string;

  /** The registered URLs of the project. */
  public urls: ProjectUrl[];

  /** The description of the project. */
  public description: string;

  /** The id of the project. */
  public id: number;

  /** The id of the user the project belongs to. */
  public user: number;

  /**
   * Constructor.
   *
   * @param obj The object to create a project from.
   */
  constructor(obj: any = {}) {
    this.name = obj.name || null;
    this.urls = obj.urls || [];
    this.description = obj.description || null;
    this.id = obj.id;
    this.user = obj.user;
  }

  getDefaultUrl(): ProjectUrl {
    return this.urls.find(url => url.default);
  }
}
