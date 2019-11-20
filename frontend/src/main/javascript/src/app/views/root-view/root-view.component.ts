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

import { User } from '../../entities/user';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import {Component, ContentChild, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AboutModalComponent } from './about-modal/about-modal.component';
import { UserLoginFormComponent } from "../../common/user-login-form/user-login-form.component";

/**
 * The controller of the index page.
 */
@Component({
  selector: 'root-view',
  templateUrl: './root-view.component.html',
  styleUrls: ['./root-view.component.scss']
})
export class RootViewComponent implements OnInit {

  @ViewChild('userLoginTabset', {static: false}) tabset;

  credentials: any;

  constructor(private appStore: AppStoreService,
              private router: Router,
              private modalService: NgbModal) {
  }

  get user(): User {
    return this.appStore.user;
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    if (this.user != null) {
      if (this.project != null) {
        this.router.navigate(['app', 'projects', this.project.id]);
      } else {
        this.router.navigate(['app', 'projects']);
      }
    }
  }

  handleLoggedIn(): void {
    this.router.navigate(['app', 'projects']);
  }

  handleSignedUp(credentials): void {
    this.credentials = credentials;
    this.tabset.select('login');
  }

  showAboutModal(): void {
    this.modalService.open(AboutModalComponent);
  }
}
