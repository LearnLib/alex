/*
 * Copyright 2015 - 2019 TU Dortmund
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

import { DriverConfigService } from '../../services/driver-config.service';
import { SettingsApiService } from '../../services/api/settings-api.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * The component to configure the web driver.
 */
@Component({
  selector: 'browser-config-form',
  templateUrl: './browser-config-form.component.html'
})
export class BrowserConfigFormComponent implements OnInit {

  configValue: any;

  @Output()
  configChange = new EventEmitter<any>();

  @Input()
  get config(): any {
    return this.configValue
  }

  set config(val: any) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  /** The list of locally installed web drivers. */
  supportedWebDrivers: string[];

  /** If the timeouts fields are displayed. */
  timeoutsCollapsed: boolean;

  /** Target web platform for the remote driver. */
  platforms: any;

  /** Target web browsers for the remote driver. */
  browsers: any;

  driverName: string;

  constructor(private settingsApi: SettingsApiService) {
    this.supportedWebDrivers = [];
    this.timeoutsCollapsed = true;

    this.platforms = {
      'Default': {
        'Any': 'ANY'
      },
      'Windows': {
        'Windows': 'WINDOWS',
        'Windows 10': 'WIN10',
        'Windows 8.1': 'WIN8_1',
        'Windows 8': 'WIN8',
        'Windows Vista': 'VISTA',
        'Windows XP': 'XP'
      },
      'Mac OS': {
        'Mac OS': 'MAC',
        'Sierra': 'SIERRA',
        'El Capitan': 'EL_CAPITAN',
        'Yosemite': 'YOSEMITE',
        'Mavericks': 'MAVERICKS',
        'Mountain Lion': 'MOUNTAIN_LION',
        'Snow Leopard': 'SNOW_LEOPARD'
      },
      'Unix': {
        'Linux': 'LINUX',
        'Unix': 'UNIX'
      }
    };

    this.browsers = {
      'Chrome': 'chrome',
      'Edge': 'MicrosoftEdge',
      'Firefox': 'firefox',
      'HTML Unit': 'htmlunit',
      'Internet Explorer': 'iexplore',
      'Opera': 'operablink',
      'Safari': 'safari'
    };
  }

  ngOnInit(): void {
    this.settingsApi.getSupportedWebDrivers().subscribe(
      data => {
        this.supportedWebDrivers = data.supportedWebDrivers
      },
      console.error
    );

    this.driverName = this.config.name;
  }

  selectWebDriver(): void {
    this.config = DriverConfigService.createFromName(this.driverName);
  }
}
