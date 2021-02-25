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

import { TestApiService } from '../../services/api/test-api.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'test-case-results-view',
  templateUrl: './test-case-results-view.component.html'
})
export class TestCaseResultsViewComponent implements OnInit {

  /** The test. */
  test: any;

  /** The results of the test. */
  results: any[];

  /** The current page object. */
  page: any;

  constructor(private appStore: AppStoreService,
              private testApi: TestApiService,
              private route: ActivatedRoute) {
    this.results = [];
    this.page = {};
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      map => {
        this.testApi.get(this.project.id, Number(map.get('testId'))).subscribe(
          test => {
            this.test = test;
            this.loadTestResults();
          },
          console.error
        );
      }
    );
  }

  loadTestResults(page: number = 0): void {
    this.testApi.getResults(this.project.id, this.test.id, page)
      .subscribe(newPage => {
        this.page = newPage;
        this.results = newPage.content;
      });
  }

  nextPage(): void {
    this.loadTestResults(Math.min(this.page.totalPages, this.page.number + 1));
  }

  previousPage(): void {
    this.loadTestResults(Math.max(0, this.page.number - 1));
  }
}
