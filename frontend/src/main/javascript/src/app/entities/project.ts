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

import { ProjectEnvironment } from './project-environment';

export interface CreateProjectForm {
  name?: string;
  description?: string;
  url?: string;
}

/**
 * The api result model for a project.
 */
export class Project {

  /** The name of the project. */
  public name: string;

  /** The registered URLs of the project. */
  public environments: ProjectEnvironment[];

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
    this.description = obj.description || null;
    this.id = obj.id;
    this.user = obj.user;

    if (obj.environments != null && obj.environments.length > 0) {
      this.environments = obj.environments.map(o => ProjectEnvironment.fromData(o))
    } else {
      this.environments = [];
    }
  }

  getDefaultEnvironment(): ProjectEnvironment {
    return this.environments.find(env => env.default);
  }

  getEnvironmentById(envId: number): ProjectEnvironment {
    return this.environments.find(e => e.id === envId);
  }

  copy(): Project {
    return new Project(JSON.parse(JSON.stringify(this)));
  }
}
