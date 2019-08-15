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

import { ProjectUrl } from './project-url';

export class ProjectEnvironment {
  id: number;
  name: string;
  project: number;
  default: boolean;
  urls: ProjectUrl[];

  static fromData(data: any): ProjectEnvironment {
    const e = new ProjectEnvironment();
    e.id = data.id;
    e.name = data.name;
    e.project = data.project;
    e.default = data.default;

    if (data.urls != null && data.urls.length > 0) {
      e.urls = data.urls.map(u => ProjectUrl.fromData(u));
    } else {
      e.urls = [];
    }

    return e;
  }

  copy(): ProjectEnvironment {
    return ProjectEnvironment.fromData(JSON.parse(JSON.stringify(this)));
  }
}