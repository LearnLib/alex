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

import { Component, Input } from '@angular/core';
import { CheckAttributeTypeRestAction } from '../../../../entities/actions/rest/check-attribute-type-action';

@Component({
  selector: 'check-attribute-type-action-form',
  templateUrl: './check-attribute-type-action-form.component.html'
})
export class CheckAttributeTypeActionFormComponent {

  @Input()
  action: CheckAttributeTypeRestAction;
}
