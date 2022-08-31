/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { TestSelectTreeStore } from '../../common/test-select-tree/test-select-tree.store';
import { TestExecutionConfig } from '../../entities/test-execution-config';
import { WebDriverConfig } from '../../entities/web-driver-config';

export abstract class TestConfigsCreateEditView {

  config: any = {
    driverConfig: new WebDriverConfig(),
    tests: []
  };

  protected constructor(protected store: TestSelectTreeStore) {
  }

  isValidConfig(): boolean {
    return TestExecutionConfig.isValid(this.config);
  }
}
