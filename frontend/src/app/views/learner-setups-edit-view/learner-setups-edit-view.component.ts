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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerSetupApiService } from '../../services/api/learner-setup-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { ToastService } from '../../services/toast.service';
import { LearnerSetupsCreateEditView } from '../learner-setups-create-view/learner-setups-create-edit-view';

@Component({
  selector: 'learner-setups-edit-view',
  templateUrl: './learner-setups-edit-view.component.html'
})
export class LearnerSetupsEditViewComponent extends LearnerSetupsCreateEditView implements OnInit {

  constructor(private route: ActivatedRoute,
              private appStore: AppStoreService,
              private learnerSetupApi: LearnerSetupApiService,
              private router: Router,
              private toastService: ToastService) {
    super();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        const setupId = Number(params.get('setupId'));
        this.learnerSetupApi.get(this.appStore.project.id, setupId).subscribe(
          setup => this.setup = setup
        );
      },
      console.error
    );
  }

  updateSetup() {
    this.learnerSetupApi.update(this.appStore.project.id, this.setup).subscribe(
      _ => {
        this.toastService.success('The learning setup has been updated.');
        this.router.navigate(['/app', 'projects', this.appStore.project.id, 'learner', 'setups']);
      },
      res => this.toastService.danger(`The setup could not be updated. ${res.error.message}`)
    );
  }
}
