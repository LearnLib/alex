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

import { remove } from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TestConfigApiService } from '../../../services/api/test-config-api.service';
import { ToastService } from '../../../services/toast.service';
import { AppStoreService } from '../../../services/app-store.service';
import { Project } from '../../../entities/project';

@Component({
  selector: 'test-config-list',
  templateUrl: './test-config-list.component.html',
  styleUrls: ['./test-config-list.component.scss']
})
export class TestConfigListComponent implements OnInit {

  @Input()
  public configs: any[];

  @Output()
  public selected: EventEmitter<any>;

  public selectedConfig: any;

  constructor(private testConfigApi: TestConfigApiService,
              private toastService: ToastService,
              private appStore: AppStoreService) {
    this.configs = [];
    this.selected = new EventEmitter<any>();
  }

  ngOnInit(): void {
    const i = this.configs.findIndex(c => c.default);
    if (i > -1) {this.selectConfig(this.configs[i]);}
  }

  selectConfig(config: any): void {
    if (this.selectedConfig != null && config != null && this.selectedConfig.id === config.id) {
      this.selectedConfig = null;
    } else {
      this.selectedConfig = config;
    }
    this.selected.emit(this.selectedConfig);
  }

  deleteConfig(config: any): void {
    this.testConfigApi.remove(config.project, config.id).subscribe(
      () => {
        remove(this.configs, {id: config.id});
        this.toastService.success('The test config has been deleted.');
        if (this.selectedConfig != null && this.selectedConfig.id === config.id) {
          this.selectConfig(null);
        }
      }
    );
  }

  makeConfigDefault(config: any): void {
    const cfg = JSON.parse(JSON.stringify(config));
    cfg.default = true;
    this.testConfigApi.update(config.project, cfg).subscribe(updatedConfig => {
        this.configs.forEach(c => c.default = false);
        const i = this.configs.findIndex(c => c.id === config.id);
        this.configs[i] = updatedConfig;
      });
  }

  get project(): Project {
    return this.appStore.project;
  }
}
