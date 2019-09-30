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

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * A service that is used as a wrapper around the toastr module.
 */
@Injectable()
export class ToastService {

  /**
   * Constructor.
   *
   * @param toastr The toastr service.
   */
  constructor(private toastr: ToastrService) {
  }

  /**
   * Create a success toast message.
   *
   * @param message The message to display.
   */
  success(message: string): void {
    this.toastr.clear();
    this.toastr.success(message);
  }

  /**
   * Create an error / danger toast message.
   *
   * @param message The message display.
   */
  danger(message: string): void {
    this.toastr.clear();
    this.toastr.error(message);
  }

  /**
   * Create an info toast message.
   *
   * @param message The message to display.
   */
  info(message: string): void {
    this.toastr.clear();
    this.toastr.info(message);
  }
}
