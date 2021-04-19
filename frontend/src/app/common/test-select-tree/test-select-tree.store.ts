/*
 * Copyright 2015 - 2021 TU Dortmund
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

import { Injectable } from '@angular/core';
import { Selectable } from '../../utils/selectable';
import { AppStoreService } from '../../services/app-store.service';
import { TestApiService } from '../../services/api/test-api.service';

@Injectable()
export class TestSelectTreeStore {

  readonly testsSelectable = new Selectable<any, number>(t => t.id);

  readonly suitesCollapsedMap = new Map<number, boolean>();

  constructor(private appStore: AppStoreService,
              private testApi: TestApiService) {
  }

  load(selectedTests: any[]): void {
    this.testsSelectable.clear();
    this.suitesCollapsedMap.clear();
    this.testApi.getRoot(this.appStore.project.id).subscribe(root => {
      const extractedTests = this.extractDescendantTests(root);
      extractedTests.forEach(test => {
        this.suitesCollapsedMap.set(test.id, true);
      })
      this.testsSelectable.addItems(extractedTests);
      this.testsSelectable.selectMany(selectedTests);
    });
  }

  isSuiteCollapsed(suite: any): boolean {
    const collapsed = this.suitesCollapsedMap.get(suite.id);
    if (collapsed == null) {
      this.suitesCollapsedMap.set(suite.id, true);
      return true;
    } else {
      return collapsed;
    }
  }

  toggleCollapseSuite(suite: any): void {
    const collapsed = this.suitesCollapsedMap.get(suite.id);
    if (collapsed == null) {
      this.suitesCollapsedMap.set(suite.id, false);
    } else {
      this.suitesCollapsedMap.set(suite.id, !collapsed);
    }
  }

  extractDescendantTests(suite: any): any[] {
    const descTests: any[] = [];
    suite.tests.filter(test => test.type === 'suite').forEach(childSuite => {
      descTests.push(...this.extractDescendantTests(childSuite));
    })
    return [...descTests, ...suite.tests];
  }
}
