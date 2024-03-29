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

import { Component, Input } from '@angular/core';
import { TestCaseLockInfo } from '../../../../services/test-presence.service';
import { AppStoreService } from '../../../../services/app-store.service';

@Component({
  selector: 'test-case-node',
  templateUrl: './test-case-node.component.html',
  styleUrls: ['../test-tree.component.scss']
})
export class TestCaseNodeComponent {

  @Input()
  public case: any;

  @Input()
  public results: any[];

  @Input()
  public lockInfo: TestCaseLockInfo;

  constructor(public appStore: AppStoreService) {
  }

  get result(): any {
    return this.results[this.case.id];
  }
}
