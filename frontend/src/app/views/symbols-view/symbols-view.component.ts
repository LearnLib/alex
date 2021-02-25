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

import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SymbolsViewStoreService } from './symbols-view-store.service';

/**
 * The controller that handles CRUD operations on symbols and symbol groups.
 */
@Component({
  selector: 'symbols-view',
  templateUrl: './symbols-view.component.html',
  providers: [SymbolsViewStoreService]
})
export class SymbolsViewComponent implements OnInit {

  constructor(private appStore: AppStoreService,
              private router: Router,
              public store: SymbolsViewStoreService) {
  }

  ngOnInit(): void {
    this.store.load();
  }

  selectSymbol(symbol: AlphabetSymbol): void {
    this.router.navigate(['/app', 'projects', this.project.id, 'symbols', symbol.id]);
  }

  get project(): Project {
    return this.appStore.project;
  }
}
