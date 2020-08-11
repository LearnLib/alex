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

import { SymbolGroup } from '../../../../entities/symbol-group';
import { Component, Input, OnInit } from '@angular/core';
import { SymbolsViewStoreService } from '../../symbols-view-store.service';
import { SymbolGroupLockInfo } from "../../../../services/symbol-presence.service";

@Component({
  selector: 'symbol-group-header',
  templateUrl: './symbol-group-header.component.html',
  styleUrls: ['./symbol-group-header.component.scss']
})
export class SymbolGroupHeaderComponent implements OnInit {

  /** The symbol group to display. */
  @Input()
  group: SymbolGroup;

  lockInfo: SymbolGroupLockInfo;

  /** Constructor. */
  constructor(public store: SymbolsViewStoreService) {
  }

  ngOnInit() {
    this.store.groupLocks$.subscribe(value => {
      this.lockInfo = value?.get(this.group.id);
    })
  }

  toggleCollapse(): void {
    const collapsed = this.store.groupsCollapsedMap.get(this.group.id);
    this.store.groupsCollapsedMap.set(this.group.id, collapsed == null ? true : !collapsed);
  }
}

