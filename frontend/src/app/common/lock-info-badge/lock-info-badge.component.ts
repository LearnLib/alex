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
import { TestCaseLockInfo } from '../../services/test-presence.service';
import { SymbolLockInfo } from '../../services/symbol-presence.service';

@Component({
  selector: 'lock-info-badge',
  templateUrl: './lock-info-badge.component.html',
  styleUrls: ['./lock-info-badge.component.scss']
})
export class LockInfoBadgeComponent {

  @Input()
  lockInfo: TestCaseLockInfo | SymbolLockInfo;
}
