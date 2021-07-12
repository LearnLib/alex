/*
 * Copyright 2018 - 2021 TU Dortmund
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

import { LearnCommandOptions, TestCommandOptions } from './types';

export const checkProjectIsDefined = (options: TestCommandOptions | LearnCommandOptions): void => {
  if (options.projectFile == null && options.projectName == null) {
    throw 'You have to specify a project either by file or by name.';
  }

  if (options.projectFile != null && options.projectName != null) {
    throw 'You cannot specify a project name and a project file at the same time.';
  }

  if (options.projectName != null && options.deleteProject) {
    throw 'You cannot delete an existing project.';
  }
};
