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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebDriverConfig } from '../../entities/web-driver-config';

/**
 * The component to configure the web driver.
 */
@Component({
  selector: 'driver-config-form',
  templateUrl: './driver-config-form.component.html'
})
export class DriverConfigFormComponent {

  @Output()
  configChange = new EventEmitter<any>();

  configValue: any;

  @Input()
  get config(): any {
    return this.configValue;
  }

  set config(val: any) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  /** If the timeouts fields are displayed. */
  timeoutsCollapsed = true;

  /** Target web platform for the remote driver. */
  platforms = WebDriverConfig.Platforms;

  /** Target web browsers for the remote driver. */
  browsers = WebDriverConfig.Browsers;
}
