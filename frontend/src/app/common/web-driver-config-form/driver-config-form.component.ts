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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { groupBy } from 'lodash';
import { WebDriverConfig } from '../../entities/web-driver-config';
import { GridApiService } from '../../services/api/grid-api.service';
import { GridStatus } from '../../entities/grid';

/**
 * The component to configure the web driver.
 */
@Component({
  selector: 'driver-config-form',
  templateUrl: './driver-config-form.component.html'
})
export class DriverConfigFormComponent implements OnInit {

  @Output()
  public configChange = new EventEmitter<any>();

  @Input()
  get config(): any {
    return this.configValue;
  }

  set config(val: any) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  public configValue: any;

  /** If the timeouts fields are displayed. */
  public timeoutsCollapsed = true;

  public gridStatus: GridStatus;

  public availableBrowsers: any;

  constructor(private gridApi: GridApiService) {
  }

  ngOnInit(): void {
    this.gridApi.getStatus().subscribe(
      status => {
        this.gridStatus = status;

        const stereotypes = this.gridStatus.value.nodes
          .map(n => n.slots[0])
          .map(s => s.stereotype);

        const availableBrowsers: any = groupBy(stereotypes, 'browserName');
        Object.keys(availableBrowsers).forEach(browser => {
          availableBrowsers[browser] = groupBy(availableBrowsers[browser], 'platformName');
        });

        this.availableBrowsers = availableBrowsers;
      },
      console.error
    );
  }

  get availableBrowsersList(): string[] {
    return this.availableBrowsers == null ? [] : Object.keys(this.availableBrowsers);
  }
}
